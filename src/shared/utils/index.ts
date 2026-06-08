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

export function generateSku(name: string, index: number): string {
    const prefix = name
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 4)
        .toUpperCase();
    const timestamp = Date.now().toString(36).substring(-4);
    return `${prefix}-${timestamp}-${index.toString().padStart(4, '0')}`;
}

export function sendPaginated<T>(
    res: Response,
    result: PaginatedResult<T>,
    message?: string,
): void {
    const response: ApiResponse<T[]> = {
        success: true,
        data: result.data,
        meta: result.meta,
    };
    if (message) response.message = message;
    res.status(200).json(response);
}
