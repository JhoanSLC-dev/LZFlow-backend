import { Router } from 'express';
import { SaleController } from './sale.controller';
import { authenticate } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createSaleSchema, saleQuerySchema } from './sale.dto';

const router = Router();
const controller = new SaleController();

router.use(authenticate);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     tags: [Sales]
 *     summary: List sales with pagination and filtering
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string }
 *       - in: query
 *         name: endDate
 *         schema: { type: string }
 */
router.get('/', validate(saleQuerySchema, 'query'), controller.findAll.bind(controller));

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     tags: [Sales]
 *     summary: Get sale details by ID
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', controller.findOne.bind(controller));

/**
 * @swagger
 * /api/sales:
 *   post:
 *     tags: [Sales]
 *     summary: Create a new sale (updates inventory automatically)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerName, items]
 *             properties:
 *               customerName:
 *                 type: string
 *               tax:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity, unitPrice]
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     unitPrice:
 *                       type: number
 */
router.post('/', validate(createSaleSchema), controller.create.bind(controller));

export default router;
