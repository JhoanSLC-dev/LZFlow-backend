import { Role } from '../constants';

export interface JwtPayload {
    userId: string;
    organizationId: string;
    role: Role;
}

export interface AuthenticatedRequest {
    user: JwtPayload;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    meta?: PaginatedResult<unknown>['meta'];
}
