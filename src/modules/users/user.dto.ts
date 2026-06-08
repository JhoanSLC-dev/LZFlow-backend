import { z } from 'zod';
import { ROLES } from '../../shared/constants';

export const createUserSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(8).max(128),
    role: z.enum([ROLES.OWNER, ROLES.MANAGER, ROLES.EMPLOYEE]).default(ROLES.EMPLOYEE),
});

export const updateUserSchema = z.object({
    name: z.string().min(2).max(255).optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    role: z.enum([ROLES.OWNER, ROLES.MANAGER, ROLES.EMPLOYEE]).optional(),
    isActive: z.boolean().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
