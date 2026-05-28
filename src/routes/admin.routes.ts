import { Router, Request, Response, NextFunction } from 'express';
import { adminService } from "../services/admin.service.js";
import { UserAccountsQuerySchema, AdminUserCreateSchema, AdminUserUpdateSchema  } from '../validations/user.schema.js';
import { ReportsQuerySchema, ReportResolveSchema } from '../validations/interactions.schema.js';
import * as idSchema from '../validations/id.schema.js';
import { AdminUserAccountsPageDto, toAdminUserAccountDto, toAdminUserDto } from '../dtos/user.dto.js';
import { ReportsPageDto, ReportDto, toReportListItemDto, toReportDto } from '../dtos/report.dto.js';


const router = Router();

/**
 * GET /admin/users?page=1&limit=20&search=abc&role=user&isActive=true&isBanned=true
 * Response: { AdminUserAccountsPageDto }
 */
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = UserAccountsQuerySchema.parse(req.query);
    const result = await adminService.getUsers(query);

    const Res: AdminUserAccountsPageDto = {
      users: result.users.map(toAdminUserAccountDto),
      pagination: result.pagination
    }

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/users/:user_id
 * Response: { AdminUserDto }
 */
router.get('/users/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = idSchema.UserIdParamSchema.parse(req.params);
    const user = await adminService.getUser(user_id);

    const Res = toAdminUserDto(user);

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /admin/users
 * Body: { AdminUserCreate }
 * Response: { AdminUserDto }
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = AdminUserCreateSchema.parse(req.body)
    const user = await adminService.createUser(req.user!, input);

    const Res = toAdminUserDto(user);

    res.json(Res);
  } catch (err) {
    next(err);
  }
});


/**
 * PATCH /admin/users/:user_id
 * Body: { AdminUserUpdate }
 * Response: { AdminUserDto }
 */
router.patch('/users/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = idSchema.UserIdParamSchema.parse(req.params);
    const input = AdminUserUpdateSchema.parse(req.body)
    const user = await adminService.updateUser(req.user!, user_id, input);

    const Res = toAdminUserDto(user);

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /admin/users/:user_id
 * Response: 204 No Content
 */
router.delete('/users/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = idSchema.UserIdParamSchema.parse(req.params);
    await adminService.deleteUser(req.user!, user_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ─── Reports ──────────────────────────────────────────────────────────────────

/**
 * GET /admin/reports?page=1&limit=20&status=pending&reporter=uuid&resolver=uuid&reported=uuid
 * Response: { ReportsPageDto }
 */
router.get('/reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ReportsQuerySchema.parse(req.query);
    const result = await adminService.getReports(query);

    const Res: ReportsPageDto = {
      reports: result.reports.map(toReportListItemDto),
      pagination: result.pagination
    };

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/reports/:report_id
 * Response: { ReportDto }
 */
router.get('/reports/:report_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { report_id } = idSchema.ReportIdParamSchema.parse(req.params);
    const report = await adminService.getReport(report_id);

    const Res: ReportDto = toReportDto(report);

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /admin/reports/:report_id
 * Body: { ReportResolve }
 * Response: { ReportDto }
 */
router.patch('/reports/:report_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { report_id } = idSchema.ReportIdParamSchema.parse(req.params);
    const input = ReportResolveSchema.parse(req.body);
    const report = await adminService.resolveReport(req.user!, report_id, input);

    const Res: ReportDto = toReportDto(report);

    res.json(Res);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/reports/stats
 * Response: { [ReportStatus]: number }
 */
router.get('/reports/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getReportStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/stats/overview
 * Response: { users: number, posts: number, comments: number, stories: number, reports: number }
 */
router.get('/stats/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getAppStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});


/**
 * DELETE /admin/posts/:post_id
 * Response: 204 No Content
 */
router.delete('/posts/:post_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = idSchema.PostIdParamSchema.parse(req.params);
    await adminService.deletePost(req.user!, post_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /admin/comments/:comment_id
 * Response: 204 No Content
 */
router.delete('/comments/:comment_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment_id } = idSchema.CommentIdParamSchema.parse(req.params);
    await adminService.deleteComment(req.user!, comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /admin/stories/:story_id
 * Response: 204 No Content
 */
router.delete('/stories/:story_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { story_id } = idSchema.StoryIdParamSchema.parse(req.params);
    await adminService.deleteStory(req.user!, story_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;