import z from 'zod';

export const registerSchema = z.object({
    organizationName: z
        .string()
        .min(2, 'Organization name must be at least 2 characters')
        .max(255, 'Organization name must be at most 255 characters'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(255, 'Name must be at most 255 characters'),
    email: z.string().email('Invalid email').toLowerCase().trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email').toLowerCase().trim(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        organizationId: string;
    };
    accessToken: string;
    refreshToken: string;
}
