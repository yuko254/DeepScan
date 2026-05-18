import { Prisma, prisma } from "../config/prisma.js";
import { ReportStatus } from "@prisma/client";
import bcrypt from "bcrypt";

import { userRepo, roleRepo, reportRepo, postRepo, commentRepo, storyRepo } from "../Repository/instances.js";
import { deepClean } from "../dtos/dto.js";
import * as user from "../dtos/users.dto.js";
import * as profile from "../dtos/profile.dto.js";
import * as report from "../dtos/report.dto.js";
import * as AppError from '../types/appErrors.types.js';

import { ProfileService } from "./profile.service.js";
import { UserService } from "./user.service.js";
import * as env from "../config/env.js"

const profileService = new ProfileService();
const userService = new UserService();
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

  async createUser(input: user.AdminCreateUserAccountBody, profile?: profile.CreateProfileBody) {
    return await prisma.$transaction(async (tx) => {
      const createdAccount = await this.createUserAccount(input, tx);
      const createdProfile = profile
        ? await profileService.createProfile(createdAccount.user_id, profile, tx)
        : null;

      return { ...createdAccount, profile: createdProfile };
    }).catch((e) => {
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

  async updateUser(userID: string, input: user.AdminUpdateUserBody) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getUser(userID);
    const { profile, is_banned, is_active, ...account } = data

    return await prisma.$transaction(async (tx) => {
      // Build update data for account (including is_banned, is_active, role_id if present)
      const accountUpdateData: any = {};
      if (Object.keys(account).length) {
        Object.assign(accountUpdateData, account);
      }
      if (is_banned !== undefined) {
        accountUpdateData.is_banned = is_banned;
      }
      if (is_active !== undefined) {
        accountUpdateData.is_active = is_active;
      }

      const [updatedAccount, updatedProfile] = await Promise.all([
        Object.keys(accountUpdateData).length
          ? userRepo.withTx(tx).update({
              where: { user_id: userID },
              data: accountUpdateData,
              include: { role: true }
            })
          : userService.getAccount(userID),
        profile
          ? 'profile_id' in profile
            ? profileService.updateProfile(profile as profile.UpdateProfileBody, { userID: userID, profileID: profile.profile_id }, tx)
            : profileService.createProfile(userID, profile as profile.CreateProfileBody, tx)
          : Promise.resolve(null),
      ]);

      return { ...updatedAccount, profile: updatedProfile };
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        if (e.code === 'P2002') throw new AppError.ConflictError('User already exists');
      }
      throw e;
    });
  }

  async deleteUser(userID: string, tx?: Prisma.TransactionClient) {
    await userRepo.withTx(tx).delete({ where: { user_id: userID } })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        throw e;
      })
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

  async getAdminStats() {
    const [usersCount, postsCount, commentsCount, storiesCount, reportsCount] = await Promise.all([
      prisma.users.count(),
      prisma.posts.count(),
      prisma.comments.count(),
      prisma.stories.count(),
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
 
  async resolveReport(reportID: string, resolverID: string, input: report.AdminUpdateReportBody) {
    const existing = await reportRepo.findById(reportID);
    if (!existing) throw new AppError.NotFoundError('Report not found');
    if (existing.status !== 'pending' && existing.status !== 'reviewed')
      throw new AppError.ConflictError('Report has already been resolved or dismissed');
 
    return await reportRepo.resolve(reportID, resolverID, input.status as ReportStatus ).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('Report not found');
      throw e;
    });
  }

  // ─── Content Moderation ──────────────────────────────────────────────────────

  async deletePost(postID: string, tx?: Prisma.TransactionClient) {
    await postRepo.withTx(tx).delete({ where: { content_id: postID } }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('Post not found');
      throw e;
    });
  }

  async deleteComment(commentID: string, tx?: Prisma.TransactionClient) {
    await commentRepo.withTx(tx).softDelete(commentID, "admin").catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('Comment not found');
      throw e;
    });
  }

  async deleteStory(storyID: string, tx?: Prisma.TransactionClient) {
    await storyRepo.withTx(tx).delete({ where: { content_id: storyID } }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('Story not found');
      throw e;
    });
  }
}

