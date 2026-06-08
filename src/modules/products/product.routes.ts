import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticate, authorize } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createProductSchema, updateProductSchema, productQuerySchema } from './product.dto';
import { ROLES } from '../../shared/constants';

const router = Router();
const controller = new ProductController();

router.use(authenticate);

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: List products with pagination, search, and filtering
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 */
router.get('/', validate(productQuerySchema, 'query'), controller.findAll.bind(controller));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', controller.findOne.bind(controller));

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     security: [{ bearerAuth: [] }]
 */
router.post(
    '/',
    authorize(ROLES.OWNER, ROLES.MANAGER),
    validate(createProductSchema),
    controller.create.bind(controller),
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product
 *     security: [{ bearerAuth: [] }]
 */
router.put(
    '/:id',
    authorize(ROLES.OWNER, ROLES.MANAGER),
    validate(updateProductSchema),
    controller.update.bind(controller),
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', authorize(ROLES.OWNER, ROLES.MANAGER), controller.remove.bind(controller));

export default router;
