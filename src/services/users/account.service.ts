import { Prisma, prisma } from "../../config/prisma.js";
import { DeviceType } from '@prisma/client';
import bcrypt from "bcrypt"
import { userRepo, deviceTokenRepo } from '../../Repository/instances.js';
import { deepClean } from "../../dtos/dto.js";
import * as user from "../../validations/user.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import * as env from "../../config/env.js";
import { profileService } from "./profile.service.js";

class UserService {
  private SALT_ROUNDS = env.SALT_ROUNDS

  // accounts

  async getAccount(userId: string, tx?: Prisma.TransactionClient) {
    const user = await userRepo.withTx(tx).findAccount(userId);
    if (!user) throw new AppError.NotFoundError('User not found');
    return user;
  }

  async getUser(userId: string, tx?: Prisma.TransactionClient) {
    const user = await userRepo.withTx(tx).findUser(userId);
    if (!user) throw new AppError.NotFoundError('User not found');
    return user;
  }

  async createAccount(input: user.AdminUserAccountCreate, tx?: Prisma.TransactionClient) {
    const { password, ...rest } = deepClean(input);
    const hashed = await bcrypt.hash(password, this.SALT_ROUNDS);

    return await userRepo.withTx(tx).createAccount({ ...rest, password: hashed })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
        }
        throw e;
      });
  }

  async registerUser(input: { username: string; email: string; password: string; first_name: string; last_name: string }) {
    const hashed = await bcrypt.hash(input.password, this.SALT_ROUNDS);

    return await prisma.$transaction(async (tx) => {
      const user = await userRepo.withTx(tx).createAccount({
        username: input.username,
        email: input.email,
        password: hashed,
      });

      await profileService.createProfile(user.user_id, {
        first_name: input.first_name,
        last_name: input.last_name,
      }, tx);

      return user;
    });
  }

  async updateAccount(userId: string, input: user.UserAccountUpdate | user.AdminUserAccountUpdate, tx?: Prisma.TransactionClient) {
    const user = deepClean(input)
    if (Object.keys(user).length === 0) return await this.getAccount(userId, tx);

    return await userRepo.withTx(tx).updateAccount(userId, user)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
          if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
        }
        throw e;
      });
  }

  async deleteAccount(input: user.UserAccount, tx?: Prisma.TransactionClient) {
    // 1. Find the user by email
    const user = await userRepo.withTx(tx).findAccountByEmail(input.email);
    if (!user) throw new AppError.NotFoundError('User not found');

    // 2. Check the password
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AppError.ValidationError('Wrong password');

    // 3. Delete the user
    await userRepo.withTx(tx).deleteById(user.user_id)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        }
        throw e;
      });
  }

  async changePass(userID: string, input: user.PasswordChange) {
    const user = await userRepo.findById(userID);
    if (!user) throw new AppError.NotFoundError('User not found');

    // Check password
    const valid = await bcrypt.compare(input.oldPass, user.password);
    if (!valid) throw new AppError.ValidationError('Wrong password');

    const hashed = await bcrypt.hash(input.newPass, env.SALT_ROUNDS);
    await userRepo.update({ where: { user_id: userID }, data: { password: hashed } })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        }
        throw e;
      });
  }

  async searchUsers(search: string, limit: number, cursor?: Date) {
    return userRepo.searchUsers(search, limit, cursor);
  }

  // Devices

  async getUserDeviceTokens(userId: string) {
    return deviceTokenRepo.findByUser(userId);
  }

  async getDeviceToken(tokenId: string, userId: string) {
    const token = await deviceTokenRepo.findById(tokenId);
    if (!token || token.user_id !== userId)
      throw new AppError.NotFoundError('Device token not found');
    return token;
  }

  async registerDeviceToken(userId: string, token: string, deviceType: DeviceType, appVersion?: string | null) {
    return deviceTokenRepo.upsertToken(userId, token, deviceType, appVersion);
  }

  async updateDeviceToken(userId: string, tokenId: string, updates: { device_type?: DeviceType; app_version?: string }) {
    const token = await deviceTokenRepo.findById(tokenId);
    if (!token || token.user_id !== userId)
      throw new AppError.NotFoundError('Device token not found');

    return deviceTokenRepo.update({
      where: { token_id: tokenId },
      data: {
        device_type: updates.device_type,
        app_version: updates.app_version,
        last_used: new Date()
      }
    });
  }

  async unregisterDeviceToken(userId: string, token: string) {
    await deviceTokenRepo.removeToken(userId, token);
  }

  async unregisterAllDeviceTokens(userId: string) {
    await deviceTokenRepo.removeAllTokens(userId);
  }
}

export const userService = new UserService();