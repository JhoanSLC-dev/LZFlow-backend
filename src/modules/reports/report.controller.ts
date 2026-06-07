import { Request, Response, NextFunction } from 'express';
import { ReportService } from './report.service';
import { sendSuccess } from '@/shared/utils';

const reportService = new ReportService();

export class ReportController {
    async getDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await reportService.getDashboard(req.user!.organizationId);
            sendSuccess(res, data);
        } catch (error) {
            next(error);
        }
    }

    async getMonthlyRevenue(req: Request, res: Response, next: NextFunction) {
        try {
            const year = req.query.year ? parseInt(req.query.year as string) : undefined;
            const data = await reportService.getMonthlyRevenue(req.user!.organizationId, year);
            sendSuccess(res, data);
        } catch (err) {
            next(err);
        }
    }

    async getTopProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const data = await reportService.getTopProducts(req.user!.organizationId, limit);
            sendSuccess(res, data);
        } catch (err) {
            next(err);
        }
    }

    async getSalesTrend(req: Request, res: Response, next: NextFunction) {
        try {
            const days = req.query.days ? parseInt(req.query.days as string) : 30;
            const data = await reportService.getSalesTrend(req.user!.organizationId, days);
            sendSuccess(res, data);
        } catch (err) {
            next(err);
        }
    }

    async getInventoryValuation(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await reportService.getInventoryValuation(req.user!.organizationId);
            sendSuccess(res, data);
        } catch (err) {
            next(err);
        }
    }
}
