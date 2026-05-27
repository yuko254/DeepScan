import multer, { MulterError } from 'multer';
import type { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and MP4 videos are allowed'));
  }
};

// Error handling wrapper for single upload
export const uploadSingle = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter,
  }).single('file');

  upload(req, res, (err: any) => {
    if (err) {
      if (err instanceof MulterError) {
        if (err.code === 'MISSING_FIELD_NAME') {
          return res.status(400).json({
            success: false,
            message: 'Missing file field. Expected field name: "file"',
            code: 'BAD_REQUEST'
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `File too large. Max size: 50MB`,
            code: 'BAD_REQUEST'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          const receivedField = err.field;

          // Check if this is a field name mismatch (single file upload)
          if (receivedField && receivedField !== 'file') {
            return res.status(400).json({
              success: false,
              message: `Invalid field name: "${receivedField}". Expected field name: "file"`,
              code: 'BAD_REQUEST'
            });
          }

          // Otherwise it's too many files
          return res.status(400).json({
            success: false,
            message: 'Too many files. This endpoint accepts only 1 file. Use /upload/multiple for multiple files',
            code: 'BAD_REQUEST'
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
        code: 'BAD_REQUEST'
      });
    }
    next();
  });
};

// Error handling wrapper for multiple upload
export const uploadMultiple = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024, files: 10 },
    fileFilter,
  }).array('files', 10);

  upload(req, res, (err: any) => {
    if (err) {
      if (err instanceof MulterError) {
        if (err.code === 'MISSING_FIELD_NAME') {
          return res.status(400).json({
            success: false,
            message: 'Missing files field. Expected field name: "files"',
            code: 'BAD_REQUEST'
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `File too large. Max size: 50MB per file`,
            code: 'BAD_REQUEST'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: `Too many files. Max: 10 files`,
            code: 'BAD_REQUEST'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          const receivedField = err.field;

          if (receivedField && receivedField !== 'files') {
            return res.status(400).json({
              success: false,
              message: `Invalid field name: "${receivedField}". Expected field name: "files"`,
              code: 'BAD_REQUEST'
            });
          }

          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum 10 files allowed',
            code: 'BAD_REQUEST'
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
        code: 'BAD_REQUEST'
      });
    }
    next();
  });
};