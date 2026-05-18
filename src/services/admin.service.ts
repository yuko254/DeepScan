import { Prisma, prisma } from "../config/prisma.js";
import { ReportStatus } from "@prisma/client";
import bcrypt from "bcrypt";

import { userRepo, roleRepo, reportRepo, postRepo, commentRepo, storyRepo, contentRepo, adminAuditRepo } from "../Repository/instances.js";
import { deepClean } from "../dtos/dto.js";
import type { accessPayload } from "../dtos/jwt.dto.js";
import * as user from "../dtos/users.dto.js";
import * as profile from "../dtos/profile.dto.js";
import * as report from "../dtos/report.dto.js";
import * as AppError from '../types/appErrors.types.js';

import { NotificationService } from "./notification.service.js";
import { AuthService } from "./auth.service.js";
import { ProfileService } from "./profile.service.js";
import { UserService } from "./userAccount.service.js";
import * as env from "../config/env.js"

const profileService = new ProfileService();
const userService = new UserService();
const authService = new AuthService();
const notificationService = new NotificationService();

const SALT_ROUNDS = env.SALT_ROUNDS
export class AdminService {
  constructor() { }

  // ─── Users ────────────────────────────────────────────────────────────────────

  async getUsers(query: user.GetUsersQuery) {
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

  async getUser(userID: string) {
    const user = await userRepo.findUser(userID);
    if (!user) throw new AppError.NotFoundError('User not found');
    return user;
  }

  async createUser(admin: accessPayload, input: user.AdminCreateUserBody) {
    const { profile, ...account } = input;
    return await prisma.$transaction(async (tx) => {
      const createdAccount = await this.createUserAccount(account, tx);
      const createdProfile = profile
        ? await profileService.createProfile(createdAccount.user_id, profile, tx)
        : null;

      const result = { ...createdAccount, profile: createdProfile };

      // audit
      await adminAuditRepo.withTx(tx).log(admin.username, 'create_user', 'users', createdAccount.user_id, null, result);

      // notification
      await notificationService.send(
        { user_id: createdAccount.user_id, actor_id: admin.user_id, type: 'system', message: 'An administrator created your account' },
        tx
      );

      return result;
    }).catch((e: any) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
      }
      throw e;
    });
  }

  async createUserAccount(input: user.AdminCreateUserAccountBody, tx?: Prisma.TransactionClient) {
    const { password, ...rest } = deepClean(input);
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    return await userRepo.withTx(tx).create({
      data: { ...rest, password: hashed },
      include: { role: true }
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
      throw e;
    });
  }

  async updateUser(admin: accessPayload, userID: string, input: user.AdminUpdateUserBody) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return await this.getUser(userID);
    let { profile, ...account } = input
    profile = data.profile;

    // fetch old snapshot
    const oldSnapshot = await userRepo.findUser(userID);

    return await prisma.$transaction(async (tx) => {
      const [updatedAccount, updatedProfile] = await Promise.all([
        userService.updateAccount(userID, account),
        profile
          ? 'profile_id' in profile
            ? profileService.updateProfile(profile as profile.UpdateProfileBody, { userID: userID, profileID: profile.profile_id }, tx)
            : profileService.createProfile(userID, profile as profile.CreateProfileBody, tx)
          : Promise.resolve(null),
      ]);

      const result = { ...updatedAccount, profile: updatedProfile };

      if (updatedAccount.is_banned)
        authService.revokeAllUserTokens(userID, "refresh");

      // audit
      await adminAuditRepo.withTx(tx).log(admin.username, 'update_user', 'users', userID, oldSnapshot, result);

      // notification
      const changes = Object.keys(account || {});
      let message: string | null = null;
      if (changes.includes('is_banned')) {
        message = updatedAccount.is_banned ? 'Your account has been banned by a moderator' : 'Your account ban has been lifted by a moderator';
      } else if (changes.includes('is_active')) {
        message = updatedAccount.is_active ? 'Your account has been reactivated by a moderator' : 'Your account has been deactivated by a moderator';
      } else if (changes.includes('role_id')) {
        message = 'Your account role has been changed by a moderator';
      } else if (changes.length > 0) {
        message = 'Your account was updated by a moderator';
      }

      if (message && oldSnapshot?.user_id) {
        await notificationService.send(
          { user_id: oldSnapshot.user_id, actor_id: admin.user_id, type: 'system', message },
          tx
        );
      }

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
    await userRepo.withTx(tx).delete({ where: { user_id: userID } })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        throw e;
      });

    await adminAuditRepo.log(admin.username, 'delete_user', 'users', userID, oldSnapshot, null);

    await authService.revokeAllUserTokens(userID, "refresh");
  }

  // ─── Roles ────────────────────────────────────────────────────────────────────

  async getRoles() {
    return roleRepo.findAll();
  }

  async deleteRole(roleID: bigint) {
    await roleRepo.delete({ where: { role_id: roleID } }).catch((e) => {
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

  async getReports(query: report.GetReportsQuery) {
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

  async resolveReport(admin: accessPayload, reportID: string, input: report.AdminUpdateReportBody) {
    const existing = await reportRepo.findById(reportID);
    if (!existing) throw new AppError.NotFoundError('Report not found');
    if (existing.status !== 'pending' && existing.status !== 'reviewed')
      throw new AppError.ConflictError('Report has already been resolved or dismissed');

    try {
      const updated = await reportRepo.resolve(reportID, admin.user_id, input.status as ReportStatus);
      await adminAuditRepo.log(admin.username, 'resolve_report', 'reports', reportID, existing, updated);

      // notify reporter that their report was resolved
      const fullReport = await reportRepo.findReport(reportID);
      const reporterId = fullReport?.user?.user_id ?? null;
      if (reporterId && reporterId !== admin.user_id) {
        const rt = fullReport!.report_target;
        const msg = 'Your report was resolved by staff';
        if (rt?.post?.content_id)
          await notificationService.sendForPostSafe({ user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg }, rt.post.content_id);
        else if (rt?.comment?.comment_id)
          await notificationService.sendForComment({ user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg }, rt.comment.comment_id);
        else
          await notificationService.send({ user_id: reporterId, actor_id: admin.user_id, type: 'system', message: msg });
      }

      return updated;
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('Report not found');
      throw e;
    }
  }

  // ─── Content Moderation ──────────────────────────────────────────────────────

  async deletePost(admin: accessPayload, postID: string, tx?: Prisma.TransactionClient) {
    const run = async (tx: Prisma.TransactionClient) => {
      const oldSnapshot = await contentRepo.withTx(tx).findById(postID);
      const updated = await contentRepo.withTx(tx).softDelete(postID, admin.username).catch((e: any) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
          if (e.code === 'P2025') throw new AppError.NotFoundError('Post not found');
        throw e;
      });

      if (oldSnapshot?.user_id && oldSnapshot.user_id !== admin.user_id) {
        await notificationService.sendForPostSafe(
          {
            user_id: oldSnapshot.user_id,
            actor_id: admin.user_id,
            type: 'system',
            message: 'Your post was removed by a moderator'
          },
          postID,
          tx
        );
      }

      await adminAuditRepo.withTx(tx).log(
        admin.username,
        'delete_post',
        'contents',
        postID,
        oldSnapshot,
        updated
      );
    }

    tx ? await run(tx) : await prisma.$transaction(run);
  }

  async deleteComment(admin: accessPayload, commentID: string, tx?: Prisma.TransactionClient) {
    const run = async (tx: Prisma.TransactionClient) => {
      const oldSnapshot = await commentRepo.withTx(tx).findById(commentID);
      const updated = await commentRepo.withTx(tx).softDelete(commentID, admin.username).catch((e: any) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
          if (e.code === 'P2025') throw new AppError.NotFoundError('Comment not found');
        throw e;
      });

      if (oldSnapshot?.user_id && oldSnapshot.user_id !== admin.user_id) {
        await notificationService.sendForComment(
          {
            user_id: oldSnapshot.user_id,
            actor_id: admin.user_id,
            type: 'system',
            message: 'Your comment was removed by a moderator'
          },
          commentID,
          tx
        );
      }

      await adminAuditRepo.withTx(tx).log(
        admin.username,
        'delete_comment',
        'comments',
        commentID,
        oldSnapshot,
        updated
      );
    };

    tx ? await run(tx) : await prisma.$transaction(run);
  }

  async deleteStory(admin: accessPayload, storyID: string, tx?: Prisma.TransactionClient) {
    const run = async (tx: Prisma.TransactionClient) => {
      const oldSnapshot = await contentRepo.withTx(tx).findById(storyID);
      const updated = await contentRepo.withTx(tx).softDelete(storyID, admin.username).catch((e: any) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
          if (e.code === 'P2025') throw new AppError.NotFoundError('Story not found');
        throw e;
      });

      if (oldSnapshot?.user_id && oldSnapshot.user_id !== admin.user_id) {
        await notificationService.send(
          {
            user_id: oldSnapshot.user_id,
            actor_id: admin.user_id,
            type: 'system',
            message: 'Your story was removed by a moderator'
          },
          tx
        );
      }

      await adminAuditRepo.withTx(tx).log(
        admin.username,
        'delete_story',
        'contents',
        storyID,
        oldSnapshot,
        updated
      );
    };

    tx ? await run(tx) : await prisma.$transaction(run);
  }
}

