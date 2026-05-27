import { z } from 'zod';

export const pageQuery = z.string()
  .optional()
  .transform((val) => Math.max(1, parseInt(val ?? '1', 10)))
  .pipe(z.number().int().positive());

export const pageLimitQuery = z.string()
  .optional()
  .transform((val) => Math.min(100, Math.max(1, parseInt(val ?? '20', 10))))
  .pipe(z.number().int().min(1).max(100));