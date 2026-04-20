import { Router, type Request, type Response, type NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { RegisterSchema, LoginSchema, RefreshTokenSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../dtos/auth.dto.js';
import { userDao, refreshTokenDao, roleDao, passwordResetDao } from '../dao/instances.js';
import { authLimiter, loginLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.use(authLimiter);

const authService = new AuthService(userDao, refreshTokenDao, roleDao, passwordResetDao);

/**
 * POST /auth/register
 * Body: { username, email, password }
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = RegisterSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = LoginSchema.parse(req.body);
    const result = await authService.login(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/refresh
 * Body: { refresh_token }
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refresh_token } = RefreshTokenSchema.parse(req.body);
    const tokens = await authService.refresh(refresh_token);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/logout
 * Body: { refresh_token }
 */
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refresh_token } = RefreshTokenSchema.parse(req.body);
    await authService.logout(refresh_token);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/forgot-password
 * Body: { email }
 */
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = ForgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(email);
    // always 200 regardless of whether email exists
    res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/reset-password
 * Body: { token, new_password }
 */
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = ResetPasswordSchema.parse(req.body);
    await authService.resetPassword(input);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
