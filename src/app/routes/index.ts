import express from 'express';
import { AnylyticsRoutes } from '../modules/analytics/anylytics.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BillingRoutes } from '../modules/billing/billing.router';
import { BrandRoutes } from '../modules/brand/brand.route';
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
  {
    path: '/billings',
    route: BillingRoutes,
  },
  {
    path: '/anylytics',
    route: AnylyticsRoutes,
  },
];

moduleRoutes.forEach(module => router.use(module.path, module.route));
export const applicationRoutes = router;
