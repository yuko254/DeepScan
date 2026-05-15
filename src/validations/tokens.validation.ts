import { z } from 'zod';

export const TokenField = z.string().min(1, 'Token is required');