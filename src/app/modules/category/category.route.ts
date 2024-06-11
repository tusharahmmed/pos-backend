import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import validateFormDataRequest from '../../middlewares/formDataValidation';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = Router();

router.post(
  '/:store_id',
  FileUploadHelper.multerUpload.single('file'),
  validateFormDataRequest(CategoryValidation.creatCategory),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  CategoryController.createCategory
);

router.get(
  '/:store_id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  CategoryController.getAllCategories
);

router.patch(
  '/:store_id/:id',
  FileUploadHelper.multerUpload.single('file'),
  validateFormDataRequest(CategoryValidation.updateCategory),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  CategoryController.updateCategory
);
router.delete(
  '/:store_id/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  CategoryController.deleteCategory
);
router.get(
  '/:store_id/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STORE_ADMIN),
  CategoryController.getSingleCategory
);

export const CategoryRoutes = router;
