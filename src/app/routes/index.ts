import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BrandRoutes } from '../modules/brand/category.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ProductRoutes } from '../modules/product/product.route';
import { StoreRoutes } from '../modules/store/store.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/stores',
    route: StoreRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/brands',
    route: BrandRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
];

moduleRoutes.forEach(module => router.use(module.path, module.route));
export const applicationRoutes = router;
