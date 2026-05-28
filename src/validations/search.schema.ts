import { z } from 'zod'

export const querySchema = z.strictObject({
  search: z.string().min(1).max(100).optional(),
  cursor: z.preprocess(
    (val) => (val && val !== 'null' && val !== 'undefined' ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  limit: z.coerce.number().int().positive().min(1).max(100).default(20)
});