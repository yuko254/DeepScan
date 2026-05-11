import { Prisma, prisma } from "../config/prisma.js";
import bcrypt from "bcrypt"
import { userRepo } from '../Repository/instances.js';
import { deepClean } from "../dtos/common.dto.js";
import * as user from "../dtos/users.dto.js"
import * as AppError from '../types/appErrors.types.js';
import * as env from "../config/env.js"

const SALT_ROUNDS = env.SALT_ROUNDS;
export class UserService {
  constructor() { }

  async getAccount(userID: string): Promise<user.UserAccountDto> {
    const user = await userRepo.findWithRole(userID);
    if (!user) throw new AppError.NotFoundError('User not found');
    return user;
  }

  async AdminCreateAccount(input: user.AdminCreateUserAccountBody, tx?: Prisma.TransactionClient): Promise<user.UserAccountDto> {
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

  async AdminDeleteAccount(userID: string, tx?: Prisma.TransactionClient) {
    await userRepo.withTx(tx).delete({ where: { user_id: userID } })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError)
          if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
        throw e;
      })
  }

  async updateAccount(userID: string, input: user.UpdateUserAccountBody | user.AdminUpdateUserAccountBody, tx?: Prisma.TransactionClient): Promise<user.UserAccountDto> {
    const user = deepClean(input)

    return await userRepo.withTx(tx).update({
      where: { user_id: userID }, data: user,
      omit: { password: true, created_at: true, role_id: true },
      include: { role: true }
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
      throw e;
    });
  }

  async deleteAccount(input: { email: string; password: string }, tx?: Prisma.TransactionClient) {
    // 1. Find the user by email
    const user = await userRepo.withTx(tx).findUnique({
      where: { email: input.email },
    });
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

  async resetPass(userID: string, input: user.ChangePasswordBody) {
    const user = await userRepo.findById(userID);
    if (!user) throw new AppError.NotFoundError('User not found');

    // Check password
    const valid = await bcrypt.compare(input.oldPass, user.password);
    if (!valid) throw new AppError.ValidationError('Wrong password');

    const hashed = await bcrypt.hash(input.newPass, SALT_ROUNDS);
    try {
      await userRepo.update({ where: { user_id: userID }, data: { password: hashed } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new AppError.NotFoundError('User not found');
      }
      throw err;
    }
  }
}
