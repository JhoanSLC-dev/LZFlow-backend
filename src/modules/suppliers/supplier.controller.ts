import { Request, Response, NextFunction } from 'express';
import { SupplierService } from './supplier.service';
import { sendSuccess } from '../../shared/utils';

const supplierService = new SupplierService();

export class SupplierController {
    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const suppliers = await supplierService.findAll(req.user!.organizationId);
            sendSuccess(res, suppliers);
        } catch (err) {
            next(err);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const supplier = await supplierService.findById(
                req.params.id,
                req.user!.organizationId,
            );
            sendSuccess(res, supplier);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const supplier = await supplierService.create(req.body, req.user!.organizationId);
            sendSuccess(res, supplier, 'Supplier created', 201);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const supplier = await supplierService.update(
                req.params.id,
                req.body,
                req.user!.organizationId,
            );
            sendSuccess(res, supplier, 'Supplier updated');
        } catch (err) {
            next(err);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await supplierService.remove(req.params.id, req.user!.organizationId);
            sendSuccess(res, null, 'Supplier deleted');
        } catch (err) {
            next(err);
        }
    }
}
