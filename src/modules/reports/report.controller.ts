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
}
