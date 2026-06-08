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

export default router;
