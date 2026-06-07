import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors';
import { config } from '../../config';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof AppError) {
        const response: Record<string, unknown> = {
            success: false,
            error: err.message,
        };
        if (err instanceof ValidationError) {
            response.details = err.details;
        }
        res.status(err.statusCode).json(response);
        return;
    }

    console.error('Unhandled error:', err);

    res.status(500).json({
        success: false,
        error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
    });
}

export function notFoundHandler(_req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
}
