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

  async register(input: auth.RegisterBody) {

    const { stayLoggedIn, ...data } = input;
    const user = await userService.registerUser(data).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Username or email already exists');
      }
      throw e;
    });

    const tokens = generateTokens(toUserAccountDto(user), input.stayLoggedIn ?? false);
    const key = `refresh:${user.user_id}:${tokens.jti}`;
    await this.redis.set(key, "active", "EX", tokens.refreshTTLSeconds);

    return { user, tokens };
  }

  async login(input: auth.LoginBody, req: Request) {
    let user = null
    if (input.email)
      user = await userRepo.findAccountByEmail(input.email);
    else if (input.username)
      user = await userRepo.findAccountByUsername(input.username)
    else throw new AppError.BadRequestError('Either username or email is needed to login');

    if (!user) throw new AppError.UnauthorizedError('Invalid email or password');

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

    // Compute hash of the token provided by the user
    const hashedToken = crypto.createHash('sha256').update(input.token).digest('hex');
    const key = `password_reset:${user.user_id}:${hashedToken}`;

    const exists = await this.redis.exists(key);
    if (!exists) throw new AppError.NotFoundError('Invalid or expired token');

    // Token is valid – delete it immediately (single‑use)
    await this.redis.del(key);

    const hashedPassword = await bcrypt.hash(input.newPassword, this.SALT_ROUNDS);
    await userRepo.update({ where: { user_id: user.user_id }, data: { password: hashedPassword } });

    // Revoke all existing refresh tokens to force re‑login on all devices
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