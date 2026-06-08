import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import { sendSuccess } from '../../shared/utils';

const categoryService = new CategoryService();

export class CategoryController {
    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await categoryService.findAll(req.user!.organizationId);
            sendSuccess(res, categories);
        } catch (err) {
            next(err);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await categoryService.findById(
                req.params.id,
                req.user!.organizationId,
            );
            sendSuccess(res, category);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await categoryService.create(req.body, req.user!.organizationId);
            sendSuccess(res, category, 'Category created', 201);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await categoryService.update(
                req.params.id,
                req.body,
                req.user!.organizationId,
            );
            sendSuccess(res, category, 'Category updated');
        } catch (err) {
            next(err);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await categoryService.remove(req.params.id, req.user!.organizationId);
            sendSuccess(res, null, 'Category deleted');
        } catch (err) {
            next(err);
        }
    }
}
