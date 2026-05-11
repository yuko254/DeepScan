import { Router, type Request, type Response, type NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { UpdateUserAccountSchema, ChangePasswordSchema, UserAccountSchema } from '../dtos/users.dto.js';
import { authenticate, authenticateStrict } from "../middlewares/auth.middleware.js"

const router = Router();

const userService = new UserService();

/**
 * GET /users/me
 */
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getAccount(req.user!.user_id);
    res.json(user);
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
    if (Object.keys(input).length === 0)
      return res.status(400).json({ error: 'No fields to update' });

    const result = await userService.updateAccount(req.user!.user_id, input);
    res.json(result);
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
    await userService.resetPass(req.user!.user_id, input);
    res.json({ message: 'Password reseted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;