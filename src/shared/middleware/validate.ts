import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const data = schema.parse(req[source]);
            req[source] = data;
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const details: Record<string, string[]> = {};
                err.errors.forEach((e) => {
                    const path = e.path.join('.');
                    if (!details[path]) {
                        details[path] = [];
                    }
                    details[path].push(e.message);
                });
                throw new ValidationError('Validation failed', details);
            }
            next(err);
        }
    };
}
