// src/middlewares/jsonParser.middleware.ts
import { Request, Response, NextFunction } from 'express';
import express from 'express';

export const jsonParser = (req: Request, res: Response, next: NextFunction) => {
  // Skip body parsing for GET requests and multipart/form-data (file uploads)
  if (req.method === 'GET' || req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  
  express.json()(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format: ' + err.message,
        code: 'BAD_REQUEST',
        statusCode: 400
      });
    }
    next();
  });
};