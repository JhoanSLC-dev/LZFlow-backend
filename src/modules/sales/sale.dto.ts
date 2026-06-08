import { z } from 'zod';

export const saleItemSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
    unitPrice: z.number().positive('Unit price must be positive'),
});

export const createSaleSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required').max(255),
    items: z.array(saleItemSchema).min(1, 'At least one item is required'),
    tax: z.number().min(0).default(0),
});

export const saleQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    status: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    customerName: z.string().optional(),
    sortBy: z.enum(['createdAt', 'total', 'customerName']).default('createdAt'),
    sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
export type SaleQueryDto = z.infer<typeof saleQuerySchema>;
