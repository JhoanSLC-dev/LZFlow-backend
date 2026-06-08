import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { sendSuccess, sendPaginated } from '../../shared/utils';

const productService = new ProductService();

export class ProductController {
    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = await productService.findAll(req.user!.organizationId, req.query as any);
            sendPaginated(res, result);
        } catch (err) {
            next(err);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.findById(req.params.id, req.user!.organizationId);
            sendSuccess(res, product);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.create(req.body, req.user!.organizationId);
            sendSuccess(res, product, 'Product created', 201);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.update(
                req.params.id,
                req.body,
                req.user!.organizationId,
            );
            sendSuccess(res, product, 'Product updated');
        } catch (err) {
            next(err);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await productService.remove(req.params.id, req.user!.organizationId);
            sendSuccess(res, null, 'Product deleted');
        } catch (err) {
            next(err);
        }
    }
}
