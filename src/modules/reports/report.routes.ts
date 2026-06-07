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

/**
 * @swagger
 * /api/reports/top-products:
 *   get:
 *     tags: [Reports]
 *     summary: Get top-selling products
 *     security: [{ bearerAuth: [] }]
 */
router.get('/top-products', controller.getTopProducts.bind(controller));

/**
 * @swagger
 * /api/reports/sales-trend:
 *   get:
 *     tags: [Reports]
 *     summary: Get sales trend over time
 *     security: [{ bearerAuth: [] }]
 */
router.get('/sales-trend', controller.getSalesTrend.bind(controller));

/**
 * @swagger
 * /api/reports/inventory-valuation:
 *   get:
 *     tags: [Reports]
 *     summary: Get inventory valuation
 *     security: [{ bearerAuth: [] }]
 */
router.get('/inventory-valuation', controller.getInventoryValuation.bind(controller));

export default router;
