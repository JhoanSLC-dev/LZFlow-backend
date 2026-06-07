import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { JwtPayload } from '../types';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { Role, ROLE_HIERARCHY } from '../constants';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        throw new UnauthorizedError('Invalid or expired token');
    }
}

export function authorize(...allowedRoles: Role[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new UnauthorizedError();
        }

        const userRole = req.user.role;
        const userLevel = ROLE_HIERARCHY[userRole];

        const hasAccess = allowedRoles.some((role) => userLevel >= ROLE_HIERARCHY[role]);

        if (!hasAccess) {
            throw new ForbiddenError('Insufficient permissions');
        }

        next();
    };
}

export function tenantGuard(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
        throw new UnauthorizedError();
    }
    next();
}
