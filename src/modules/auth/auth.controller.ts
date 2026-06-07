import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../shared/utils';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);
            sendSuccess(res, result, 'Registration successful', 201);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);
            sendSuccess(res, result, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.refreshToken(req.body.refreshToken);
            sendSuccess(res, result, 'Token refreshed');
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.forgotPassword(req.body.email);
            sendSuccess(res, null, 'If the email exists, a reset link has been sent');
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.resetPassword(req.body.token, req.body.password);
            sendSuccess(res, null, 'Password reset successful');
        } catch (error) {
            next(error);
        }
    }
}
