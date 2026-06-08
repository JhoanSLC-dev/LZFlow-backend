import { Request, Response, NextFunction } from 'express';
import { SaleService } from './sale.service';
import { sendSuccess, sendPaginated } from '../../shared/utils';

const saleService = new SaleService();

export class SaleController {
    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = await saleService.findAll(req.user!.organizationId, req.query as any);
            sendPaginated(res, result);
        } catch (err) {
            next(err);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const sale = await saleService.findById(req.params.id, req.user!.organizationId);
            sendSuccess(res, sale);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const sale = await saleService.create(
                req.body,
                req.user!.organizationId,
                req.user!.userId,
            );
            sendSuccess(res, sale, 'Sale created', 201);
        } catch (err) {
            next(err);
        }
    }
}
