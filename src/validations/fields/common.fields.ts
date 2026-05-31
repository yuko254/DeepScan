import { z } from 'zod';

export const IdSchema = {
  uuid: (field: string) => z.uuid(`${field} must be a valid UUID`),
  number: (field: string) => z.coerce.number(`${field} must be a valid number`)
    .int(`${field} must be an integer`)
    .positive(`${field} must be a positive number`)
};

<<<<<<< HEAD
export const JsonSchema = z.record(z.any(), z.any());
=======
export const JsonSchema = z.union([
  z.record(z.any(), z.any()).refine(
    (obj) => Object.keys(obj).length > 0,
    { message: "JSON object cannot be empty" }
  ),
  z.array(z.any()).refine(
    (arr) => arr.length > 0,
    { message: "JSON array cannot be empty" }
  ),
]);

export const booleanString = z
  .enum(['true', 'false'])
  .transform(val => val === 'true');
>>>>>>> dev
