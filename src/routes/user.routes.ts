import { Router, type Request, type Response, type NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { UpdateUserSchema, DeleteUserSchema, PasswordSchema } from '../dtos/user.dto.js';
import { authenticate, authenticateStrict } from "../middlewares/auth.middleware.js"
import { userDao, roleDao } from '../dao/instances.js';

const router = Router();

const userService = new UserService(userDao, roleDao);

/**
 * GET /users/me
 */
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.account(req.user!.user_id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /users/me
 * Body: { username, email }
 */
router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const input = UpdateUserSchema.parse(req.body);
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
 * Body: { username, email }
 */
router.delete('/me', authenticateStrict, async (req, res, next) => {
  try {
    const input = DeleteUserSchema.parse(req.body);
    await userService.deleteAccount(req.user!.user_id);
    res.status(204).send();
  } catch (err) {
    next(err); 
  }
});

/**
 * PATCH /users/me/password
 * Body: { oldpassword, newpassword }
 */
router.patch("/me/password", authenticateStrict, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = PasswordSchema.parse(req.body);
    await userService.resetPass(input, req.user!.user_id);
    res.status(200).json({ message: 'Password reseted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;