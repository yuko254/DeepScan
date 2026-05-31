import { Router, type Request, type Response, type NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
<<<<<<< HEAD
import { RegisterSchema, LoginSchema, RefreshTokenSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validations/auth.schema.js';
=======
import { RegisterSchema, LoginSchema, RefreshTokenSchema, emailSchema, ResetPasswordSchema, VerifyEmailSchema } from '../validations/auth.schema.js';
>>>>>>> dev
import type { AuthDto, TokensDto } from '../dtos/auth.dto.js';
import { authLimiter, loginLimiter, passwordResetLimiter } from '../middlewares/rateLimit.middleware.js';
import * as env from '../config/env.js';
import { toUserAccountDto } from '../dtos/user.dto.js';

const router = Router();

router.use(authLimiter);

// ─── Cookie config ────────────────────────────────────────
const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: env.ACCESS_TOKEN_TTL_MS,
  path: '/',
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: env.REFRESH_TOKEN_TTL_MS,
  path: '/auth/refresh',
};

/**
 * POST /auth/register
 * Body: { RegisterBody }
<<<<<<< HEAD
 * Response: { AuthDto }
=======
 * Response: { message: string, user: UserAccountDto }
>>>>>>> dev
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = RegisterSchema.parse(req.body);
<<<<<<< HEAD
    const { user, tokens } = await authService.register(input);

    if (input.stayLoggedIn)
      REFRESH_COOKIE_OPTIONS.maxAge = 365 * 24 * 60 * 60 * 1000
    res.cookie('access_token', tokens.access_token, ACCESS_COOKIE_OPTIONS);
    res.cookie('refresh_token', tokens.refresh_token, REFRESH_COOKIE_OPTIONS);

    const Res = {
      user: toUserAccountDto(user),
      tokens: {
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token
      }
    } as AuthDto

    res.status(201).json(Res);
=======
    const { user, message } = await authService.register(input);

    res.status(201).json({
      message,
      user: toUserAccountDto(user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/verify-email
 * Body: { token: string }
 */
router.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = VerifyEmailSchema.parse(req.body);
    await authService.verifyEmail(token);

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/resend-verification
 * Body: { email: string }
 */
router.post('/resend-verification', passwordResetLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = emailSchema.parse(req.body);
    await authService.resendVerificationEmail(email);
    res.json({ message: 'Verification email sent' });
>>>>>>> dev
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/login
 * Body: { LoginBody }
 * Response: { AuthDto }
 */
router.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = LoginSchema.parse(req.body);
    const { user, tokens } = await authService.login(input, req);

    if (input.stayLoggedIn)
      REFRESH_COOKIE_OPTIONS.maxAge = 365 * 24 * 60 * 60 * 1000
    res.cookie('access_token', tokens.access_token, ACCESS_COOKIE_OPTIONS);
    res.cookie('refresh_token', tokens.refresh_token, REFRESH_COOKIE_OPTIONS);

    const Res = {
      user: toUserAccountDto(user),
      tokens: {
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token
      }
    } as AuthDto

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/refresh
 * cookie: { refresh_token }
 * Body: { refresh_token }
 * Response: { TokensDto }
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      refreshToken = RefreshTokenSchema.parse(req.body).refresh_token;
    }
    const tokens = await authService.refresh(refreshToken);

    res.cookie('access_token', tokens.access_token, ACCESS_COOKIE_OPTIONS);
    res.cookie('refresh_token', tokens.refresh_token, REFRESH_COOKIE_OPTIONS);

    const Res = {
<<<<<<< HEAD
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token
=======
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token
>>>>>>> dev
    } as TokensDto

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/logout
 * cookie: { refresh_token }
 * Body: { refresh_token }
 */
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      refreshToken = RefreshTokenSchema.parse(req.body).refresh_token;
    }
    await authService.logout(refreshToken);

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/forgot-password
 * Body: { email }
 */
router.post('/forgot-password', passwordResetLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
<<<<<<< HEAD
    const { email } = ForgotPasswordSchema.parse(req.body);
=======
    const { email } = emailSchema.parse(req.body);
>>>>>>> dev
    await authService.forgotPassword(email, req);
    // always 200 regardless of whether email exists
    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/reset-password
 * Body: { email, token, new_password }
 */
router.post('/reset-password', passwordResetLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = ResetPasswordSchema.parse(req.body);
    await authService.resetPassword(input);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
