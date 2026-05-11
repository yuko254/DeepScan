import { Router, type Request, type Response, type NextFunction } from 'express';
import { AdminService } from "../services/admin.service.js";
import { GetUsersQuerySchema, GetUserParam, AdminUpdateUserSchema, AdminCreateUserAccountSchema } from '../dtos/users.dto.js';

const router = Router();

const adminService = new AdminService();

/**
 * GET /admin/users?page=1&limit=20&search=abc&role=user
 * Response: { users: UserAccountDto[], pagination: PageDto }
 */
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = GetUsersQuerySchema.parse(req.query);
    const result = await adminService.getUsers(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/users/:user_id
 * Response: { UserDto }
 */
router.get('/users/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = GetUserParam.parse(req.params);
    const result = await adminService.getUser(user_id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /admin/users/:user_id
 * Body: { AdminCreateUserBody }
 * Response: { UserDto }
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = AdminCreateUserAccountSchema.parse(req.body)
    const result = await adminService.createUser(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
});


/**
 * PATCH /admin/users/:user_id
 * Body: { AdminUpdateUserBody }
 * Response: { UserDto }
 */
router.patch('/users/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = GetUserParam.parse(req.params);
    const input = AdminUpdateUserSchema.parse(req.body)
    const result = await adminService.updateUser(user_id, input);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /admin/users/:user_id
 * Response: { UserDto }
 */
router.delete('/users/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = GetUserParam.parse(req.params);
    await adminService.deleteUser(user_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});


export default router;