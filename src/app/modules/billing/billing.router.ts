import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BillingController } from './billing.controller';
import { BillingValidation } from './billing.validation';

const router = Router();

router.post(
  '/:store_id',
  validateRequest(BillingValidation.createBilling),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  BillingController.creatBillingRecord
);

router.get(
  '/:store_id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  BillingController.getAllBillingRecords
);

export const BillingRoutes = router;
