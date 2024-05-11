import express from 'express';
import { StoreRoutes } from '../modules/store/store.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/stores',
    route: StoreRoutes,
  },
];

moduleRoutes.forEach(module => router.use(module.path, module.route));
export const applicationRoutes = router;
