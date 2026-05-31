import { Request } from "express";
import { Prisma } from "../config/prisma.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import RedisClient from '../config/redis.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils.js';
import { getLocationFromIP } from '../utils/location.util.js';
import * as emailUtil from '../utils/email.util.js';
import { userRepo } from '../Repository/instances.js';
import { toUserAccountDto } from "../dtos/user.dto.js";
import * as auth from "../validations/auth.schema.js";
import * as jwt from "../validations/jwt.schema.js";
import * as AppError from '../types/appErrors.types.js';
import * as env from '../config/env.js';
import { notificationService } from "./notification.service.js";
import { userService } from "./users/account.service.js";

class AuthService {
  private redis = RedisClient.getInstance();
  private SALT_ROUNDS = env.SALT_ROUNDS;

  async getEmailVerificationToken(userId: string) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const key = `email_verify:${userId}:${hashedToken}`;
    await this.redis.set(key, '1', 'EX', 24 * 60 * 60);

    return verificationToken;
  }

  async register(input: auth.RegisterBody) {
    const user = await userService.registerUser(input).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
      }
      throw e;
    });

    const verificationToken = await this.getEmailVerificationToken(user.user_id);

    await emailUtil.sendVerificationEmail(user.email, verificationToken);

    return {
      user,
      message: 'Verification email sent. Please verify your email before logging in.'
    };
  }

  async verifyEmail(token: string) {
    const keys = await this.redis.keys(`email_verify:*:${token}`);
    if (keys.length === 0) throw new AppError.NotFoundError('Invalid or expired verification token');

    const key = keys[0]!;
    const userId = key.split(':')[1];

    const exists = await this.redis.exists(key);
    if (!exists) throw new AppError.NotFoundError('Invalid or expired token');

    await userRepo.update({
      where: { user_id: userId },
      data: { is_email_verified: true }
    });

    await this.redis.del(key);
  }

  async resendVerificationEmail(email: string) {
    const user = await userRepo.findAccountByEmail(email);
    if (!user) return; // prevent enumeration
    if (user.is_email_verified) return;

    const oldKeys = await this.redis.keys(`email_verify:${user.user_id}:*`);
    if (oldKeys.length > 0) await this.redis.del(oldKeys);

    const verificationToken = await this.getEmailVerificationToken(user.user_id);

    await emailUtil.sendVerificationEmail(user.email, verificationToken);
  }

  async login(input: auth.LoginBody, req: Request) {
    let user = null
    if (input.email)
      user = await userRepo.findAccountByEmail(input.email);
    else if (input.username)
      user = await userRepo.findAccountByUsername(input.username)
    else throw new AppError.BadRequestError('Either username or email is needed to login');

    if (!user) throw new AppError.UnauthorizedError('Invalid email or password');
    if (!user.is_email_verified) throw new AppError.ForbiddenError('Please verify your email before logging in');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AppError.UnauthorizedError('Invalid email or password');

    if (user.is_banned) throw new AppError.ForbiddenError('Your account has been banned');

    const tokens = generateTokens(toUserAccountDto(user), input.stayLoggedIn ?? false);
    const key = `refresh:${user.user_id}:${tokens.jti}`;
    await this.redis.set(key, "active", "EX", tokens.refreshTTLSeconds);

    const userAgent = req.headers['user-agent'] || 'Unknown device';
    const ip = req.ip || req.socket.remoteAddress || 'Unknown IP';
    const location = getLocationFromIP(ip);

    await emailUtil.sendLoginAlertEmail(user.email, userAgent, ip, location);

    return { user, tokens };
  }

  async refresh(refresh_token: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refresh_token) as jwt.refreshPayload;
    } catch {
      throw new AppError.UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await userRepo.findAccount(payload.user_id)
    if (!user) throw new AppError.NotFoundError('User no longer exists');
    if (user.is_banned) throw new AppError.ForbiddenError('Your account has been banned');

    const key = `refresh:${payload.user_id}:${payload.jti}`;
    const state = await this.redis.get(key);

    // Key missing → token expired or never existed → just reject
    if (state === null) {
      throw new AppError.UnauthorizedError('Refresh token is invalid');
    }

    // Key already used → token reuse detected → revoke all and reject
    if (state === "consumed") {
      await this.revokeAllUserTokens(payload.user_id, "refresh");
      throw new AppError.UnauthorizedError('Refresh token has been revoked or is invalid');
    }

    // Rotation: issue new tokens, mark old key
    const RemainingSeconds = payload.exp! - Math.floor(Date.now() / 1000);
    await this.redis.set(key, 'consumed', 'EX', RemainingSeconds);

    const newTokens = generateTokens(toUserAccountDto(user), false);
    const newKey = `refresh:${user.user_id}:${newTokens.jti}`;
    await this.redis.set(newKey, "active", 'EX', newTokens.refreshTTLSeconds);

    return newTokens;
  }

  async logout(refresh_token: string) {
    try {
      const payload = verifyRefreshToken(refresh_token);
      const key = `refresh:${payload.user_id}:${payload.jti}`;
      await this.redis.del(key);
    } catch {
      // token is already invalid — nothing to revoke
    }
  }

  async forgotPassword(email: string, req: Request) {
    const user = await userRepo.findAccountByEmail(email);
    if (!user) return; // prevents user enumeration

    await this.revokeAllUserTokens(user.user_id, 'password_reset')

    const token = crypto.randomBytes(4).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const key = `password_reset:${user.user_id}:${hashedToken}`;
    await this.redis.set(key, '1', 'EX', env.PASSWORD_RESET_TOKEN_IN_SECONDS);

    await emailUtil.sendPasswordResetEmail(user.email, token);

    const userAgent = req.headers['user-agent'] || 'Unknown device';
    const ip = req.ip || req.socket.remoteAddress || 'Unknown IP';

    await notificationService.send({
      user_id: user.user_id,
      actor_id: null,
      type: 'system',
      message: `A password reset was requested for your account. details: ${userAgent}, IP: ${ip}`
    });
  }

  async resetPassword(input: auth.ResetPasswordBody) {
    const user = await userRepo.findAccountByEmail(input.email);
    if (!user) return; // prevents user enumeration

    const hashedToken = crypto.createHash('sha256').update(input.token).digest('hex');
    const key = `password_reset:${user.user_id}:${hashedToken}`;

    const exists = await this.redis.exists(key);
    if (!exists) throw new AppError.NotFoundError('Invalid or expired token');

    await this.redis.del(key);

    const hashedPassword = await bcrypt.hash(input.newPassword, this.SALT_ROUNDS);
    await userRepo.update({ where: { user_id: user.user_id }, data: { password: hashedPassword } });

    await this.revokeAllUserTokens(user.user_id, 'refresh');

    await emailUtil.sendPasswordResetSuccessEmail(user.email);
  }

  async revokeAllUserTokens(userId: string, context: string) {
    const keys: string[] = [];
    const stream = this.redis.scanStream({
      match: `${context}:${userId}:*`,
      count: 100,
    });

    // Collect all matching keys
    for await (const chunk of stream) {
      keys.push(...chunk);
    }

    // Delete them in one pipeline if any exist
    if (keys.length > 0) {
      const pipeline = this.redis.pipeline();
      keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    }
  }
}

export const authService = new AuthService()