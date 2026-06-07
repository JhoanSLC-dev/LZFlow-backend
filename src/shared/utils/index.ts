import { Response } from 'express';
import { ApiResponse, PaginatedResult } from '../types';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
    const response: ApiResponse<T> = {
        success: true,
        data,
    };
    if (message) response.message = message;
    res.status(statusCode).json(response);
}
