import { Prisma, prisma } from "../config/prisma.js";
import { userRepo, roleRepo, reportRepo, postRepo, commentRepo, storyRepo, contentRepo, adminAuditRepo } from "../Repository/instances.js";
import * as emailUtil from '../utils/email.util.js';
import { deepClean } from "../dtos/dto.js";
import { accessPayload } from "../validations/jwt.schema.js";
import * as report from "../validations/interactions.schema.js";
import * as user from "../validations/user.schema.js";
import * as AppError from '../types/appErrors.types.js';
import { notificationService } from "./notification.service.js";
import { authService } from "./auth.service.js";
import { profileService } from "./users/profile.service.js";
import { userService } from "./users/account.service.js";

class AdminService {

  // ─── Users ────────────────────────────────────────────────────────────────────

  async getUsers(query: user.UserAccountsQuery) {
    const skip = (query.page - 1) * query.limit;
    const [users, total] = await Promise.all([
      userRepo.getPage(query.limit, skip, query.filters),
      userRepo.countByFilter(query.filters),
    ]);

    return {
      users: users,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getUser(userId: string) {
    const user = await userRepo.findUser(userId);
    if (!user) throw new AppError.NotFoundError('User not found');
    return user;
  }

  async createUser(admin: accessPayload, input: user.AdminUserCreate) {
    const { profile, ...account } = deepClean(input);

    return prisma.$transaction(async (tx) => {
      const createdAccount = await userService.createAccount(account, tx);
      const createdProfile = await profileService.resolveProfile(createdAccount.user_id, profile, undefined, tx);

      const result = { ...createdAccount, profile: createdProfile };

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'create', 'users', createdAccount.user_id, null, createdAccount),
        createdProfile
          ? adminAuditRepo.withTx(tx).log(admin.username, 'create', 'profiles', createdProfile.profile_id, null, createdProfile)
          : Promise.resolve(undefined),
        notificationService.send({ user_id: createdAccount.user_id, actor_id: admin.user_id, type: 'system', message: 'An administrator created your account' }, tx),
        emailUtil.sendVerificationEmail(createdAccount.email, await authService.getEmailVerificationToken(createdAccount.user_id))
      ]);

      return result;
    }).catch((e: any) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
      }
      throw e;
    });
  }

  async updateUser(admin: accessPayload, userId: string, input: user.AdminUserUpdate) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getUser(userId);

    const { profile, ...account } = data;

    const oldSnapshot = await userRepo.findUser(userId);
    if (!oldSnapshot) throw new AppError.NotFoundError('User not found');

    return prisma.$transaction(async (tx) => {
      const [updatedAccount, updatedProfile] = await Promise.all([
        userService.updateAccount(userId, account, tx),
        profileService.resolveProfile(userId, profile, oldSnapshot.profile?.profile_id, tx)
      ]);

      const result = { ...updatedAccount, profile: updatedProfile };

      const accountChanges = Object.keys(account);
      const messages: string[] = [];
      const emailTasks: Promise<any>[] = [];

      if (accountChanges.includes('is_banned')) {
        messages.push(updatedAccount.is_banned
          ? 'Your account has been banned by a moderator'
          : 'Your account ban has been lifted by a moderator');

        if (updatedAccount.is_banned) {
          emailTasks.push(emailUtil.sendAccountBannedEmail(updatedAccount.email));
        } else {
          emailTasks.push(emailUtil.sendAccountUnbannedEmail(updatedAccount.email));
        }
      }

      if (accountChanges.includes('is_active')) {
        messages.push(updatedAccount.is_active
          ? 'Your account has been reactivated by a moderator'
          : 'Your account has been deactivated by a moderator');

        if (updatedAccount.is_active) {
          emailTasks.push(emailUtil.sendAccountReactivatedEmail(updatedAccount.email));
        } else {
          emailTasks.push(emailUtil.sendAccountDeactivatedEmail(updatedAccount.email));
        }
      }

      if (accountChanges.includes('role_id')) {
        messages.push('Your account role has been changed by a moderator');
      }

      const finalMessage = messages.join('\n');

      await Promise.all([
        ...emailTasks,
        (updatedAccount.is_banned && !oldSnapshot.is_banned)
          ? authService.revokeAllUserTokens(userId, "refresh")
          : Promise.resolve(undefined),
        adminAuditRepo.withTx(tx).log(admin.username, 'update', 'users', userId, oldSnapshot, updatedAccount),
        adminAuditRepo.withTx(tx).log(admin.username, 'update', 'profiles', oldSnapshot.profile?.profile_id, oldSnapshot.profile, updatedProfile),
        finalMessage.length !== 0
          ? notificationService.send({ user_id: oldSnapshot.user_id, actor_id: admin.user_id, type: 'system', message: finalMessage }, tx)
          : Promise.resolve(undefined)
      ]);

      return result;
    }).catch((e: any) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        if (e.code === 'P2002') throw new AppError.ConflictError('User already exists');
      }
      throw e;
    });
  }

  async deleteUser(admin: accessPayload, userId: string, tx?: Prisma.TransactionClient) {
    const oldSnapshot = await userRepo.findUser(userId);
    if (!oldSnapshot) throw new AppError.NotFoundError('User not found');

    await userRepo.withTx(tx).deleteById(userId)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        }
        console.log(e)
      });

    await Promise.all([
      adminAuditRepo.log(admin.username, 'delete', 'users', userId, oldSnapshot, null),
      authService.revokeAllUserTokens(userId, "refresh"),
      emailUtil.sendAccountDeletedEmail(oldSnapshot.email)
    ])
  }

  // ─── Roles ────────────────────────────────────────────────────────────────────

  async getRoles() {
    return roleRepo.findAll();
  }

  async deleteRole(roleID: number) {
    await roleRepo.deleteById(roleID).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('Role not found');
        if (e.code === 'P2003') throw new AppError.ConflictError('Cannot delete role that is still assigned to users');
      }
      throw e;
    });
  }

  // ─── Admin dashboard ──────────────────────────────────────────────────────────────

  async getAppStats() {
    const [usersCount, postsCount, commentsCount, storiesCount, reportsCount] = await Promise.all([
      userRepo.count({}),
      postRepo.count({}),
      commentRepo.count({}),
      storyRepo.count({}),
      reportRepo.countByStatus(),
    ]);

    return {
      users: usersCount,
      posts: postsCount,
      comments: commentsCount,
      stories: storiesCount,
      reports: reportsCount,
    };
  }

  async getAuditLog(audit_id: string) {
    const audit = await adminAuditRepo.findAudit(audit_id);
    if (!audit) throw new AppError.NotFoundError('Audit log not found');
    return audit;
  }

  async getAuditLogs(query: user.AuditLogsQuery) {
    const { page, limit, filters } = query;
    const skip = (page - 1) * limit;

    const [audits, total] = await Promise.all([
      adminAuditRepo.getPage(limit, skip, filters),
      adminAuditRepo.countByFilters(filters),
    ]);

    return {
      audits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Reports ──────────────────────────────────────────────────────────────────

  async resolveReport(admin: accessPayload, reportID: string, input: report.ReportResolve) {
    return prisma.$transaction(async (tx) => {
      const existing = await reportRepo.withTx(tx).findById(reportID);
      if (!existing) throw new AppError.NotFoundError('Report not found');
      if (existing.status !== 'pending' && existing.status !== 'reviewed')
        throw new AppError.ConflictError('Report has already been resolved or dismissed');

      const updated = await reportRepo.withTx(tx).resolve(reportID, admin.user_id, input.status);

      const reporterId = updated?.reporter_id;

      const tasks: Promise<any>[] = [
        adminAuditRepo.withTx(tx).log(admin.username, 'update', 'reports', reportID, existing, updated)
      ];

      if (reporterId && reporterId !== admin.user_id) {
        const rt = updated!.report_target;
        const msg = 'Your report was resolved by staff';

        if (rt?.post_id) {
          tasks.push(notificationService.sendForPostSafe(
            { user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg },
            rt.post_id,
            tx
          ));
        } else if (rt?.comment_id) {
          tasks.push(notificationService.sendForComment(
            { user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg },
            rt.comment_id,
            tx
          ));
        } else {
          tasks.push(notificationService.send(
            { user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg },
            tx
          ));
        }
      }

      await Promise.all(tasks);

      return updated;
    }).catch((e: any) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('Report not found');
      }
      throw e;
    });
  }

  // ─── Content Moderation ──────────────────────────────────────────────────────

  async deletePost(admin: accessPayload, postID: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const oldSnapshot = await contentRepo.withTx(tx).findById(postID);
      if (!oldSnapshot) throw new AppError.NotFoundError('Post not found');

      const updated = await contentRepo.withTx(tx).softDelete(postID, admin.username);

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'delete', 'contents', postID, oldSnapshot, updated),
        oldSnapshot.user_id && oldSnapshot.user_id !== admin.user_id
          ? notificationService.sendForPostSafe(
            { user_id: oldSnapshot.user_id, actor_id: admin.user_id, type: 'system', message: 'Your post was removed by a moderator' },
            postID,
            tx
          )
          : Promise.resolve()
      ]);
    });
  }

  async deleteComment(admin: accessPayload, commentID: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const oldSnapshot = await commentRepo.withTx(tx).findById(commentID);
      if (!oldSnapshot) throw new AppError.NotFoundError('Comment not found');

      const updated = await commentRepo.withTx(tx).softDelete(commentID, admin.username);

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'delete', 'comments', commentID, oldSnapshot, updated),
        oldSnapshot.user_id && oldSnapshot.user_id !== admin.user_id
          ? notificationService.sendForComment(
            { user_id: oldSnapshot.user_id, actor_id: admin.user_id, type: 'system', message: 'Your comment was removed by a moderator' },
            commentID,
            tx
          )
          : Promise.resolve()
      ]);
    });
  }

  async deleteStory(admin: accessPayload, storyID: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const oldSnapshot = await contentRepo.withTx(tx).findById(storyID);
      if (!oldSnapshot) throw new AppError.NotFoundError('Story not found');

      const updated = await contentRepo.withTx(tx).softDelete(storyID, admin.username);

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'delete', 'contents', storyID, oldSnapshot, updated),
        oldSnapshot.user_id && oldSnapshot.user_id !== admin.user_id
          ? notificationService.send(
            { user_id: oldSnapshot.user_id, actor_id: admin.user_id, type: 'system', message: 'Your story was removed by a moderator' },
            tx
          )
          : Promise.resolve()
      ]);
    });
  }
}

export const adminService = new AdminService();