import { z } from 'zod';

export const IdSchema = {
  uuid: (field: string) => z.uuid(`${field} must be a valid UUID`),
  number: (field: string) => z.coerce.number(`${field} must be a valid number`)
    .int(`${field} must be an integer`)
    .positive(`${field} must be a positive number`)
};

export const JsonSchema = z.record(z.any(), z.any());