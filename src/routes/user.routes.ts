import { Router, type Request, type Response, type NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { UpdateUserAccountSchema, ChangePasswordSchema, UserAccountSchema, toUserAccountDto } from '../dtos/users.dto.js';
import { authenticate, authenticateStrict } from "../middlewares/auth.middleware.js"

const router = Router();

const userService = new UserService();

/**
 * GET /users/me
 */
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getAccount(req.user!.user_id);
    const Res = toUserAccountDto(user)
    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /users/me
 * Body: { username, email }
 */
router.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = UpdateUserAccountSchema.parse(req.body);
    const user = await userService.updateAccount(req.user!.user_id, input);
    const Res = toUserAccountDto(user)
    res.json(Res);
  } catch (err) {
    next(err); 
  }
});

/**
 * DELETE /users/me
 * Body: { username, email, password }
 */
router.delete('/me', authenticateStrict, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = UserAccountSchema.parse(req.body);
    await userService.deleteAccount(input);
    res.status(204).send();
  } catch (err) {
    next(err); 
  }
});

/**
 * PATCH /users/me/change-password
 * Body: { oldpassword, newpassword }
 */
router.patch("/me/change-password", authenticateStrict, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = ChangePasswordSchema.parse(req.body);
    await userService.changePass(req.user!.user_id, input);
    res.json({ message: 'Password reseted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;