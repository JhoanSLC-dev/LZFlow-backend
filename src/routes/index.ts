import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import reportRoutes from '../modules/reports/report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);

export default router;
