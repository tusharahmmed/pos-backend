import express from 'express';

const router = express.Router();

const moduleRoutes = [
  // {
  //   path: '/auth',
  //   route: AuthRoutes,
  // },
];

moduleRoutes.forEach(module => router.use(module.path, module.route));
export const applicationRoutes = router;
