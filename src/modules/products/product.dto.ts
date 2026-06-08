import { z } from 'zod';
import { PRODUCT_STATUS } from '../../shared/constants';

export const createProductSchema = z.object({
    categoryId: z.string().uuid().optional().nullable(),
    supplierId: z.string().uuid().optional().nullable(),
    name: z.string().min(1, 'Product name is required').max(255),
    description: z.string().optional().nullable(),
    costPrice: z.number().positive('Cost price must be positive'),
    salePrice: z.number().positive('Sale price must be positive'),
    stockQuantity: z.number().int().min(0, 'Stock cannot be negative').default(0),
    minimumStock: z.number().int().min(0).default(0),
});

export const updateProductSchema = z.object({
    categoryId: z.string().uuid().optional().nullable(),
    supplierId: z.string().uuid().optional().nullable(),
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional().nullable(),
    costPrice: z.number().positive().optional(),
    salePrice: z.number().positive().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    minimumStock: z.number().int().min(0).optional(),
    status: z
        .enum([PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE, PRODUCT_STATUS.DISCONTINUED])
        .optional(),
});

export const productQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
    status: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    lowStock: z.coerce.boolean().optional(),
    sortBy: z.enum(['name', 'createdAt', 'salePrice', 'stockQuantity']).default('createdAt'),
    sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
