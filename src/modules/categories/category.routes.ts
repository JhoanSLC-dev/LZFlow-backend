import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authenticate, authorize } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createCategorySchema, updateCategorySchema } from './category.dto';
import { ROLES } from '../../shared/constants';

const router = Router();
const controller = new CategoryController();

router.use(authenticate);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List all categories
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', controller.findOne.bind(controller));

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a category
 *     security: [{ bearerAuth: [] }]
 */
router.post(
    '/',
    authorize(ROLES.OWNER, ROLES.MANAGER),
    validate(createCategorySchema),
    controller.create.bind(controller),
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update a category
 *     security: [{ bearerAuth: [] }]
 */
router.put(
    '/:id',
    authorize(ROLES.OWNER, ROLES.MANAGER),
    validate(updateCategorySchema),
    controller.update.bind(controller),
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', authorize(ROLES.OWNER, ROLES.MANAGER), controller.remove.bind(controller));

export default router;
