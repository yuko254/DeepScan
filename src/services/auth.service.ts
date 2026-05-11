import { Prisma } from "../config/prisma.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import RedisClient from '../config/redis.js';

import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils.js';
import { sendPasswordResetEmail } from '../utils/email.util.js';

import { userRepo } from '../Repository/instances.js';

import * as auth from '../dtos/auth.dto.js';
import * as AppError from '../types/appErrors.types.js';
import * as env from '../config/env.js';

const SALT_ROUNDS = env.SALT_ROUNDS;
const redis = RedisClient.getInstance()
export class AuthService {
  constructor() { }

  async register(input: auth.RegisterBody): Promise<auth.AuthDto> {
    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepo.create({
      data: {
        username: input.username,
        email: input.email,
        password: hashed,
      },
      include: { role: true },
      omit: { password: true, role_id: true, created_at: true }
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already taken');
      }
      throw e;
    });

    const tokens = generateTokens(user);

    // Store the hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, SALT_ROUNDS);
    const key = `refresh:${user.user_id}:${tokens.jti}`;
    await redis.set(key, hashedRefreshToken, 'EX', env.REFRESH_TOKEN_TTL_SECONDS);

    return { user: user, tokens: tokens };
  }

  async login(input: auth.LoginBody): Promise<auth.AuthDto> {
    // Find user
    const user = await userRepo.findUnique({
      where: { email: input.email },
      include: { role: true },
      omit: { role_id: true, created_at: true }
    });
    if (!user) throw new AppError.UnauthorizedError('Invalid email or password');

    // Check password
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AppError.UnauthorizedError('Invalid email or password');

    const tokens = generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, SALT_ROUNDS);
    const key = `refresh:${user.user_id}:${tokens.jti}`;
    await redis.set(key, hashedRefreshToken, 'EX', env.REFRESH_TOKEN_TTL_SECONDS);

    return { user: user, tokens: tokens };
  }

  async refresh(refresh_token: string): Promise<auth.TokensDto> {
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refresh_token);
    } catch {
      throw new AppError.UnauthorizedError('Invalid or expired refresh token');
    }

    // Ensure user still exists
    const user = await userRepo.findUnique({ 
      where: { user_id: payload.user_id},
      include: { role: true },
      omit: { password: true, role_id: true, created_at: true }
    });
    if (!user) throw new AppError.NotFoundError('User no longer exists');

    // Find the stored (hashed) token
    const key = `refresh:${payload.user_id}:${payload.jti}`;
    const storedHash = await redis.get(key);
    if (!storedHash) {
      // Token reuse / not found → revoke all sessions for this user
      await this.revokeAllUserTokens(payload.user_id, "refresh");
      throw new AppError.UnauthorizedError('Refresh token has been revoked or is invalid');
    }

    // Verify the raw token matches the stored hash
    const isValid = await bcrypt.compare(refresh_token, storedHash);
    if (!isValid) {
      throw new AppError.UnauthorizedError('Refresh token is invalid');
    }

    // Rotation: delete old key, issue new tokens
    await redis.del(key);

    const newTokens = generateTokens(user);

    // Store the new refresh token
    const newKey = `refresh:${user.user_id}:${newTokens.jti}`;
    const newHashed = await bcrypt.hash(newTokens.refresh_token, SALT_ROUNDS);
    await redis.set(newKey, newHashed, 'EX', env.REFRESH_TOKEN_TTL_SECONDS);

    return newTokens;
  }

  async logout(refresh_token: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refresh_token);
      const key = `refresh:${payload.user_id}:${payload.jti}`;
      await redis.del(key);
    } catch {
      // token is invalid anyway
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await userRepo.findUnique({ where: { email: email } });

    // always return success even if email not found — prevents user enumeration
    if (!user) return;

    const token = crypto.randomBytes(4).toHex();
    const key = `password_reset:${user.user_id}:${token}`;
    await redis.set(key, user.user_id, 'EX', env.PASSWORD_RESET_TOKEN_IN_MIN);
    await sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(input: auth.ResetPasswordBody): Promise<void> {
    const user_id = await redis.get(`password_reset:${input.token}`);
    if (!user_id) throw new AppError.NotFoundError('Invalid or expired token');
    await redis.del(`password_reset:${user_id}:${input.token}`);

    const hashed = await bcrypt.hash(input.new_password, SALT_ROUNDS);
    await userRepo.update({ where: { user_id: user_id }, data: { password: hashed } });

    await this.revokeAllUserTokens(user_id, "password_reset");
  }

  async revokeAllUserTokens(userId: string, token: string): Promise<void> {
    const keys: string[] = [];
    const stream = redis.scanStream({
      match: `${token}:${userId}:*`,
      count: 100,
    });

    // Collect all matching keys
    for await (const chunk of stream) {
      keys.push(...chunk);
    }

    // Delete them in one pipeline if any exist
    if (keys.length > 0) {
      const pipeline = redis.pipeline();
      keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    }
  }
}
