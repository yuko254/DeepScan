import { z } from 'zod';

export const TokenField = z.string().min(1, 'Refresh token is required');