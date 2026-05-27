import { Prisma, prisma } from "../config/prisma.js";
import { userRepo, roleRepo, reportRepo, postRepo, commentRepo, storyRepo, contentRepo, adminAuditRepo } from "../Repository/instances.js";
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

    return await prisma.$transaction(async (tx) => {
      const createdAccount = await userService.createAccount(account, tx);
      const createdProfile = await profileService.resolveProfile(createdAccount.user_id, profile, undefined, tx);

      const result = { ...createdAccount, profile: createdProfile };

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'create user', 'users', createdAccount.user_id, null, createdAccount),
        createdProfile
          ? adminAuditRepo.withTx(tx).log(admin.username, 'create profile', 'profiles', createdProfile.profile_id, null, createdProfile)
          : Promise.resolve(undefined),
        notificationService.send({ user_id: createdAccount.user_id, actor_id: admin.user_id, type: 'system', message: 'An administrator created your account' }, tx)
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
    if (Object.keys(data).length === 0) return await this.getUser(userId);

    const { profile, ...account } = data;

    const oldSnapshot = await userRepo.findUser(userId);
    if (!oldSnapshot) throw new AppError.NotFoundError('User not found');

    return await prisma.$transaction(async (tx) => {
      const [updatedAccount, updatedProfile] = await Promise.all([
        userService.updateAccount(userId, account, tx),
        profileService.resolveProfile(userId, profile, oldSnapshot.profile?.profile_id, tx)
      ]);

      const result = { ...updatedAccount, profile: updatedProfile };

      const accountChanges = Object.keys(account);
      const importantChanges = ['is_banned', 'is_active', 'role_id'].some(field => accountChanges.includes(field));
      let message = '';

      if (importantChanges && oldSnapshot.user_id) {
        if (accountChanges.includes('is_banned')) {
          message = updatedAccount.is_banned
            ? 'Your account has been banned by a moderator'
            : 'Your account ban has been lifted by a moderator';
        } else if (accountChanges.includes('is_active')) {
          message = updatedAccount.is_active
            ? 'Your account has been reactivated by a moderator'
            : 'Your account has been deactivated by a moderator';
        } else if (accountChanges.includes('role_id')) {
          message = 'Your account role has been changed by a moderator';
        }
      }

      await Promise.all([
        (updatedAccount.is_banned && !oldSnapshot.is_banned)
          ? authService.revokeAllUserTokens(userId, "refresh")
          : Promise.resolve(undefined),
        adminAuditRepo.withTx(tx).log(admin.username, 'update user', 'users', userId, oldSnapshot, updatedAccount),
        adminAuditRepo.withTx(tx).log(admin.username, 'update profile', 'profiles', oldSnapshot.profile?.profile_id, oldSnapshot.profile, updatedProfile),
        message.length !== 0
          ? notificationService.send({ user_id: oldSnapshot.user_id, actor_id: admin.user_id, type: 'system', message }, tx)
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

  async deleteUser(admin: accessPayload, userID: string, tx?: Prisma.TransactionClient) {
    const oldSnapshot = await userRepo.findUser(userID);
    if (!oldSnapshot) throw new AppError.NotFoundError('User not found');

    await userRepo.withTx(tx).deleteById(userID)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        }
        throw e;
      });

    await Promise.all([
      adminAuditRepo.log(admin.username, 'delete user', 'users', userID, oldSnapshot, null),
      notificationService.send({ user_id: oldSnapshot.user_id, actor_id: admin.user_id, type: 'system', message: 'your account has been deleted by a moderator' }, tx),
      authService.revokeAllUserTokens(userID, "refresh")
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

  // ─── Admin Stats ──────────────────────────────────────────────────────────────

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

  // ─── Reports ──────────────────────────────────────────────────────────────────

  async getReports(query: report.ReportsQuery) {
    const skip = (query.page - 1) * query.limit;
    const [reports, total] = await Promise.all([
      reportRepo.getPage(query.limit, skip, query.filters),
      reportRepo.countByFilter(query.filters),
    ]);

    return {
      reports: reports,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async getReport(reportID: string) {
    const report = await reportRepo.findReport(reportID);
    if (!report) throw new AppError.NotFoundError('Report not found');
    return report;
  }

  async getReportStats() {
    return reportRepo.countByStatus();
  }

  async resolveReport(admin: accessPayload, reportID: string, input: report.ReportResolve) {
    return await prisma.$transaction(async (tx) => {
      const existing = await reportRepo.withTx(tx).findById(reportID);
      if (!existing) throw new AppError.NotFoundError('Report not found');
      if (existing.status !== 'pending' && existing.status !== 'reviewed')
        throw new AppError.ConflictError('Report has already been resolved or dismissed');

      const updated = await reportRepo.withTx(tx).resolve(reportID, admin.user_id, input.status);

      const reporterId = updated?.reporter_id;

      const tasks: Promise<any>[] = [
        adminAuditRepo.withTx(tx).log(admin.username, 'resolve report', 'reports', reportID, existing, updated)
      ];

      if (reporterId && reporterId !== admin.user_id) {
        const rt = updated!.report_target;
        const msg = 'Your report was resolved by staff';

        if (rt?.post?.content_id) {
          tasks.push(notificationService.sendForPostSafe(
            { user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg },
            rt.post.content_id,
            tx
          ));
        } else if (rt?.comment?.comment_id) {
          tasks.push(notificationService.sendForComment(
            { user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg },
            rt.comment.comment_id,
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
    return await (tx || prisma).$transaction(async (tx) => {
      const oldSnapshot = await contentRepo.withTx(tx).findById(postID);
      if (!oldSnapshot) throw new AppError.NotFoundError('Post not found');

      const updated = await contentRepo.withTx(tx).softDelete(postID, admin.username);

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'delete post', 'contents', postID, oldSnapshot, updated),
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
    return await (tx || prisma).$transaction(async (tx) => {
      const oldSnapshot = await commentRepo.withTx(tx).findById(commentID);
      if (!oldSnapshot) throw new AppError.NotFoundError('Comment not found');

      const updated = await commentRepo.withTx(tx).softDelete(commentID, admin.username);

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'delete comment', 'comments', commentID, oldSnapshot, updated),
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
    return await (tx || prisma).$transaction(async (tx) => {
      const oldSnapshot = await contentRepo.withTx(tx).findById(storyID);
      if (!oldSnapshot) throw new AppError.NotFoundError('Story not found');

      const updated = await contentRepo.withTx(tx).softDelete(storyID, admin.username);

      await Promise.all([
        adminAuditRepo.withTx(tx).log(admin.username, 'delete story', 'contents', storyID, oldSnapshot, updated),
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