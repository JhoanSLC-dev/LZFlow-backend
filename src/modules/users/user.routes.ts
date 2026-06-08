import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../shared/middleware/auth';
import { ROLES } from '../../shared/constants';
import { validate } from '../../shared/middleware/validate';
import { createUserSchema, updateUserSchema } from './user.dto';

const router = Router();
const controller = new UserController();

router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users in organization
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', controller.findOne.bind(controller));

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     security: [{ bearerAuth: [] }]
 */
router.post(
    '/',
    authorize(ROLES.OWNER),
    validate(createUserSchema),
    controller.create.bind(controller),
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user
 *     security: [{ bearerAuth: [] }]
 */
router.put(
    '/:id',
    authorize(ROLES.OWNER),
    validate(updateUserSchema),
    controller.update.bind(controller),
);

export default router;
