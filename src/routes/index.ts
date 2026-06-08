import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import reportRoutes from '../modules/reports/report.routes';
import userRoutes from '../modules/users/user.routes';
import categoryRoutes from '../modules/categories/category.routes';
import supplierRoutes from '../modules/suppliers/supplier.routes';
import productRoutes from '../modules/products/product.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);

export default router;
