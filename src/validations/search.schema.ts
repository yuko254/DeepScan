import { z } from 'zod'

export const querySchema = z.strictObject({
  search: z.string().min(1).max(100).optional(),
  cursor: z.coerce.date().optional(),
  limit: z.coerce.number().int().positive().min(1).max(100).default(20)
});