import { z } from 'zod';
import { ROLES } from '../../shared/constants';

export const createUserSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(8).max(128),
    role: z.enum([ROLES.OWNER, ROLES.MANAGER, ROLES.EMPLOYEE]).default(ROLES.EMPLOYEE),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
