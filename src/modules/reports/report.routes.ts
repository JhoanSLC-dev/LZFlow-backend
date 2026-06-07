import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticate, authorize } from '../../shared/middleware/auth';
import { ROLES } from '../../shared/constants';

const router = Router();
const controller = new ReportController();

router.use(authenticate);
router.use(authorize(ROLES.OWNER, ROLES.MANAGER));

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     tags: [Reports]
 *     summary: Get dashboard KPIs
 *     security: [{ bearerAuth: [] }]
 */
router.get('/dashboard', controller.getDashboard.bind(controller));

/**
 * @swagger
 * /api/reports/monthly-revenue:
 *   get:
 *     tags: [Reports]
 *     summary: Get monthly revenue breakdown
 *     security: [{ bearerAuth: [] }]
 */
router.get('/monthly-revenue', controller.getMonthlyRevenue.bind(controller));

export default router;
