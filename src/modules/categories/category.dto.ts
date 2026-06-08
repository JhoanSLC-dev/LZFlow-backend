import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(255),
    description: z.string().optional().nullable(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional().nullable(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
