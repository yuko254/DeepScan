import { Router, type Request, type Response, type NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { RegisterSchema, LoginSchema, RefreshTokenSchema, LogoutSchema } from '../dtos/auth.dto.js';
import { UserDao, RefreshTokenDao, RoleDao } from '../dao/DAO.js';
import { authLimiter, loginLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.use(authLimiter);

const authService = new AuthService(new UserDao(), new RefreshTokenDao(), new RoleDao());

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
    const { refresh_token } = LogoutSchema.parse(req.body);
    await authService.logout(refresh_token);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
