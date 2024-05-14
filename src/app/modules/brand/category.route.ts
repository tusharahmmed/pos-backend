import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import validateFormDataRequest from '../../middlewares/formDataValidation';
import { BrandController } from './brand.controller';
import { BrandValidation } from './brand.validation';

const router = Router();

router.post(
  '/:store_id',
  FileUploadHelper.multerUpload.single('file'),
  validateFormDataRequest(BrandValidation.creatBrand),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  BrandController.createBrand
);

router.get(
  '/:store_id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  BrandController.getAllBrands
);

router.patch(
  '/:store_id/:id',
  FileUploadHelper.multerUpload.single('file'),
  validateFormDataRequest(BrandValidation.updateBrand),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  BrandController.updateBrand
);
router.delete(
  '/:store_id/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  BrandController.deleteBrand
);

export const BrandRoutes = router;
