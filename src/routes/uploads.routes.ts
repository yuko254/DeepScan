import { Router, type Request, type Response, type NextFunction } from 'express';
import { uploadSingle, uploadMultiple } from '../middlewares/upload.middleware.js';
import { uploadService } from '../services/uploads.service.js';
import * as AppError from '../types/appErrors.types.js';

const router = Router();

// Upload single file
router.post('/single', uploadSingle, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await uploadService.uploadSingleFile(
      req.file,
      req.user!.user_id
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple files
router.post('/multiple', uploadMultiple, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) throw new AppError.BadRequestError('No files uploaded');

    const results = await uploadService.uploadMultipleFiles(
      files,
      req.user!.user_id
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

// Delete file
router.delete('/:key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    
    if (!key || typeof key !== 'string') throw new AppError.BadRequestError("Valid key parameter is required");

    if (!key.startsWith(`users/${req.user!.user_id}/`)) throw new AppError.ForbiddenError('You can only delete your own files');

    await uploadService.deleteFile(key);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;