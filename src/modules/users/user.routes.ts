import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../shared/middleware/auth';

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

export default router;
