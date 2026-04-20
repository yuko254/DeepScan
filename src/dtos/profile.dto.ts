import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  bio: 
    z.string()
    .max(500, 'Bio can have at most 500 characters')
    .optional(),
  private:
    z.boolean(),
  avatar: 
    z.url("invalid URL")
    .optional(),
  birth_location:
    z.string()
    .optional(),
  current_location:
    z.string()
    .optional(),
  first_name: 
    z.string()
    .max(50, "'first name must be at most 50 characters'")
    .optional(),
  last_name: 
    z.string()
    .max(50, "'last name must be at most 50 characters'")
    .optional(),
  phone_number: 
    z.string()
    .max(20, "'phone number must be at most 20 characters'")
    .optional(),
  birth_date: 
    z.coerce.date("invalid date")
    .optional(),
});

export const SearchProfileSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});