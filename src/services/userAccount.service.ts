import { Prisma } from "../config/prisma.js";
import bcrypt from "bcrypt"

import { userRepo } from '../Repository/instances.js';
import { deepClean } from "../dtos/dto.js";

import * as user from "../dtos/users.dto.js"
import * as AppError from '../types/appErrors.types.js';
import * as env from "../config/env.js"
export class UserService {
  constructor() { }

  async getAccount(userID: string, tx?: Prisma.TransactionClient) {
    const user = await userRepo.withTx(tx).findAccount(userID);
    if (!user) throw new AppError.NotFoundError('User not found');
    return user;
  }

  async updateAccount(userID: string, input: user.UpdateUserAccountBody | user.AdminUpdateUserAccountBody, tx?: Prisma.TransactionClient) {
    const user = deepClean(input)
    if (Object.keys(user).length === 0)
      return await this.getAccount(userID, tx);

    return await userRepo.withTx(tx).update({
      where: { user_id: userID },
      data: user,
      include: { role: true }
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
      if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
      throw e;
    });
  }

  async deleteAccount(input: user.UserAccountBody, tx?: Prisma.TransactionClient) {
    // 1. Find the user by email
    const user = await userRepo.withTx(tx).findAccountByEmail(input.email);
    if (!user) throw new AppError.NotFoundError('User not found');

    // 2. Check the password
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AppError.ValidationError('Wrong password');

    // 3. Delete the user
    await userRepo.withTx(tx).delete({ where: { user_id: user.user_id } })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        }
        throw e;
      });
  }

  async changePass(userID: string, input: user.ChangePasswordBody) {
    const user = await userRepo.findById(userID);
    if (!user) throw new AppError.NotFoundError('User not found');

    // Check password
    const valid = await bcrypt.compare(input.oldPass, user.password);
    if (!valid) throw new AppError.ValidationError('Wrong password');

    const hashed = await bcrypt.hash(input.newPass, env.SALT_ROUNDS);
    try {
      await userRepo.update({ where: { user_id: userID }, data: { password: hashed } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
      }
      throw e;
    }
  }
}
