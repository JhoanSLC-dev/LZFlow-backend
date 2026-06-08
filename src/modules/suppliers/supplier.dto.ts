import { z } from 'zod';

export const createSupplierSchema = z.object({
    companyName: z.string().min(1, 'Company name is required').max(255),
    contactName: z.string().min(1, 'Contact name is required').max(255),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required').max(50),
    address: z.string().optional().nullable(),
});

export const updateSupplierSchema = z.object({
    companyName: z.string().min(1).max(255).optional(),
    contactName: z.string().min(1).max(255).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).max(50).optional(),
    address: z.string().optional().nullable(),
});

export type CreateSupplierDto = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>;
