import { Prisma, prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

import { userRepo } from "../Repository/instances.js";
import { deepClean } from "../dtos/dto.js";
import * as user from "../dtos/users.dto.js";
import * as profile from "../dtos/profile.dto.js";
import * as AppError from '../types/appErrors.types.js';

import { ProfileService } from "./profile.service.js";
import { UserService } from "./user.service.js";
import * as env from "../config/env.js"

const profileService = new ProfileService();
const userService = new UserService();
const SALT_ROUNDS = env.SALT_ROUNDS
export class AdminService {
  constructor() { }

  async getUsers(query: user.GetUsersQuery): Promise<user.UsersAccountsPageDto> {
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

  async getUser(userID: string): Promise<user.UserDto> {
    const user = await userRepo.findUser(userID);
    if (!user) throw new AppError.NotFoundError('User not found');
    return user;
  }

  async createUser(input: user.AdminCreateUserAccountBody, profile?: profile.CreateProfileBody): Promise<user.UserDto> {
    return await prisma.$transaction(async (tx) => {
      const createdAccount = await this.createAccount(input, tx);
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

  async updateUser(userID: string, input: user.AdminUpdateUserBody): Promise<user.UserDto> {
    const { profile, ...account } = deepClean(input);

    return await prisma.$transaction(async (tx) => {
      const [updatedAccount, updatedProfile] = await Promise.all([
        Object.keys(account).length
          ? userService.updateAccount(userID, account as user.AdminUpdateUserAccountBody, tx)
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

  async deleteUser(userID: string, tx?: Prisma.TransactionClient): Promise<void> {
    await userRepo.withTx(tx).delete({ where: { user_id: userID } })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        throw e;
      })
  }

  async createAccount(input: user.AdminCreateUserAccountBody, tx?: Prisma.TransactionClient): Promise<user.UserAccountDto> {
    const { password, ...rest } = deepClean(input);
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    return await userRepo.withTx(tx).create({
      data: { ...rest, password: hashed },
      omit: { password: true, created_at: true, role_id: true },
      include: { role: true }
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
      throw e;
    });
  }
}
