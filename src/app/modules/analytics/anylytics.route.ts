import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AnylyticsController } from './anylytics.controller';

const router = Router();

router.get(
  '/brand_reports/:store_id',
  auth(ENUM_USER_ROLE.STORE_ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AnylyticsController.getBrandReports
);
router.get(
  '/daily_sells/:store_id',
  auth(ENUM_USER_ROLE.STORE_ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AnylyticsController.getDailySellsCount
);

export const AnylyticsRoutes = router;
