import bcrypt from 'bcrypt';
import { UserDao, RefreshTokenDao, RoleDao, PasswordResetDao } from '../dao/index.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils.js';
import { sendPasswordResetEmail } from '../utils/email.util.js';
import type { RegisterInput, LoginInput, ResetPasswordInput, AuthResponseDto, TokensDto } from '../dtos/auth.dto.js';
import * as AppError from '../types/appErrors.types.js';

const SALT_ROUNDS = 12;
export class AuthService {
  constructor(
    private userDao: UserDao,
    private refreshTokenDao: RefreshTokenDao,
    private roleDao: RoleDao,
    private passwordResetDao: PasswordResetDao,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponseDto> {
    // Check username taken
    const existingUsername = await this.userDao.find({ username: input.username });
    if (existingUsername) throw new AppError.ConflictError('Username already taken');

    // Check email taken
    const existingEmail = await this.userDao.find({ email: input.email });
    if (existingEmail) throw new AppError.ConflictError('Email already registered');

    // Hash password
    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const user = await this.userDao.create({
      username: input.username,
      email: input.email,
      password: hashed,
    });

    const role = await this.roleDao.find({ role_id: user.role_id! });
    const userDto = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role_name: role?.role_name ?? 'user',
    };

    const tokens = generateTokens(userDto);

    // Store the hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, SALT_ROUNDS);
    await this.refreshTokenDao.createToken({
      userId: user.user_id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { user: userDto, tokens };
  }

  async login(input: LoginInput): Promise<AuthResponseDto> {
    // Find user
    const user = await this.userDao.find({ email: input.email });
    if (!user) throw new AppError.UnauthorizedError('Invalid email or password');

    // Check password
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AppError.UnauthorizedError('Invalid email or password');

    const role = await this.roleDao.find({ role_id: user.role_id! });
    const userDto = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role_name: role?.role_name ?? 'user',
    };

    const tokens = generateTokens(userDto);

    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, SALT_ROUNDS);
    await this.refreshTokenDao.createToken({
      userId: user.user_id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { user: userDto, tokens: tokens };
  }

  async refresh(refresh_token: string): Promise<TokensDto> {
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refresh_token);
    } catch {
      throw new AppError.UnauthorizedError('Invalid or expired refresh token');
    }

    // Ensure user still exists
    const user = await this.userDao.find({ user_id: payload.user_id });
    if (!user) throw new AppError.NotFoundError('User no longer exists');

    // Find the stored (hashed) token
    const storedTokens = await this.refreshTokenDao.findByToken(refresh_token);
    if (!storedTokens) {
      // Token not found in DB - possible theft attempt!
      // For enhanced security, revoked all tokens for this user here.
      await this.refreshTokenDao.deleteAllForUser(user.user_id);
      throw new AppError.UnauthorizedError('Refresh token has been revoked or is invalid');
    }

    // Verify the raw token matches the stored hash
    const isValid = await bcrypt.compare(refresh_token, storedTokens.token);
    if (!isValid) {
      throw new AppError.UnauthorizedError('Refresh token is invalid');
    }

    // Token is valid, so we can revoke it (token rotation)
    await this.refreshTokenDao.deleteByToken(storedTokens.token);

    const role = await this.roleDao.find({ role_id: user.role_id! });
    const userDto = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role_name: role?.role_name ?? 'user',
    };
    const newTokens = generateTokens(userDto);

    // Store the new refresh token
    const newHashedToken = await bcrypt.hash(newTokens.refresh_token, SALT_ROUNDS);
    await this.refreshTokenDao.createToken({
      userId: user.user_id,
      token: newHashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return newTokens;
  }

  async logout(refresh_token: string): Promise<void> {
    // Find and delete the specific token
    await this.refreshTokenDao.deleteByToken(refresh_token);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userDao.find({ email });

    // always return success even if email not found — prevents user enumeration
    if (!user) return;

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await this.passwordResetDao.createNew(user.user_id, token);
    await sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const record = await this.passwordResetDao.findByToken(input.token);

    if (!record) throw new AppError.UnauthorizedError('Invalid or expired reset token');
    if (record.expires_at < new Date()) {
      await this.passwordResetDao.deleteByToken(input.token);
      throw new AppError.UnauthorizedError('Reset token has expired');
    }

    const hashed = await bcrypt.hash(input.new_password, SALT_ROUNDS);
    await this.userDao.update({ user_id: record.user_id }, { password: hashed });

    // invalidate token + revoke all sessions
    await this.passwordResetDao.deleteByToken(input.token);
    await this.refreshTokenDao.deleteAllForUser(record.user_id);
  }
}
