import bcrypt from "bcrypt"
import { RoleDao, UserDao } from '../dao/index.js';
import type { PasswordInput, UpdateUserInput, UserResponseDto } from '../dtos/user.dto.js';
import { Prisma } from "@prisma/client";
import * as AppError from '../types/appErrors.types.js';


const SALT_ROUNDS = 12;

export class UserService {
  constructor(
    private userDao: UserDao,
    private roleDao: RoleDao
  ) {}

  async account(userID: string): Promise<UserResponseDto> {
    const user = await this.userDao.findWithRole(userID);

    const userDto = {
      user_id: user!.user_id,
      username: user!.username,
      email: user!.email,
      role: user!.roles?.role_name,
    };

    return userDto
  }

  async updateAccount(user_id: string, input: UpdateUserInput): Promise<UserResponseDto> {
    const data = Object.fromEntries(
    Object.entries(input).filter(([_, v]) => v !== undefined)) as Prisma.usersUpdateInput;

    const result = await this.userDao.update({ user_id }, data);
    const role = await this.roleDao.findById(result.role_id!);
    return {
      user_id: result.user_id,
      username: result.username,
      email: result.email,
      role: role?.role_name
    }
  }

  async deleteAccount(user_id: string) {
    await this.userDao.delete({ user_id: user_id });
  }

  async resetPass(input: PasswordInput, userID: string) {
    // get user password
    const user = await this.userDao.findById(userID);

    // Check password
    const valid = await bcrypt.compare(input.oldPass, user!.password);
    if (!valid) throw new AppError.ValidationError('Wrong password');

    const hashed = await bcrypt.hash(input.newPass, SALT_ROUNDS);
    await this.userDao.update({ user_id: userID }, { password: hashed });
  }
}
