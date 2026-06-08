import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendSuccess } from '../../shared/utils';

const userService = new UserService();

export class UserController {
    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.findByOrganization(req.user!.organizationId);
            sendSuccess(res, users);
        } catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.findById(req.params.id, req.user!.organizationId);
            sendSuccess(res, user);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.create(req.body, req.user!.organizationId);
            sendSuccess(res, user, 'User created', 201);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.update(
                req.params.id,
                req.body,
                req.user!.organizationId,
            );
            sendSuccess(res, user, 'User updated');
        } catch (err) {
            next(err);
        }
    }
}
