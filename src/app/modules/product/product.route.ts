import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import validateFormDataRequest from '../../middlewares/formDataValidation';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = Router();

router.delete(
  '/:store_id/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  ProductController.deleteSingleProduct
);

router.patch(
  '/:store_id/:id',
  FileUploadHelper.multerUpload.single('file'),
  validateFormDataRequest(ProductValidation.updateProduct),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  ProductController.updateSingeProduct
);

router.get(
  '/:store_id/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  ProductController.getSingleProduct
);

router.post(
  '/:store_id',
  FileUploadHelper.multerUpload.single('file'),
  validateFormDataRequest(ProductValidation.creatProduct),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  ProductController.createProduct
);

router.get(
  '/:store_id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  ProductController.getAllProducts
);

export const ProductRoutes = router;
