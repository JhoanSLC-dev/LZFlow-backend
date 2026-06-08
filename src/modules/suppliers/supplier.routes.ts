import { Router } from 'express';
import { SupplierController } from './supplier.controller';
import { authenticate, authorize } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createSupplierSchema, updateSupplierSchema } from './supplier.dto';
import { ROLES } from '../../shared/constants';

const router = Router();
const controller = new SupplierController();

router.use(authenticate);

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     tags: [Suppliers]
 *     summary: List all suppliers
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     tags: [Suppliers]
 *     summary: Get supplier by ID
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', controller.findOne.bind(controller));

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     tags: [Suppliers]
 *     summary: Create a supplier
 *     security: [{ bearerAuth: [] }]
 */
router.post(
    '/',
    authorize(ROLES.OWNER, ROLES.MANAGER),
    validate(createSupplierSchema),
    controller.create.bind(controller),
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     tags: [Suppliers]
 *     summary: Update a supplier
 *     security: [{ bearerAuth: [] }]
 */
router.put(
    '/:id',
    authorize(ROLES.OWNER, ROLES.MANAGER),
    validate(updateSupplierSchema),
    controller.update.bind(controller),
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     tags: [Suppliers]
 *     summary: Delete a supplier
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', authorize(ROLES.OWNER, ROLES.MANAGER), controller.remove.bind(controller));

export default router;
