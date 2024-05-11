import { Router } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { StoreController } from './store.controller';

const router = Router();

router.post(
  '/',
  FileUploadHelper.multerUpload.single('file'),
  // formDataValidation(StoreValidation.createStore),
  StoreController.createStore
);

router.patch(
  '/:id',
  FileUploadHelper.multerUpload.single('file'),
  // formDataValidation(StoreValidation.createStore),
  StoreController.updateStore
);

router.get('/:id', StoreController.getSingleStoreById);

router.delete('/:id', StoreController.deleteStoreById);

router.get('/', StoreController.getAllStores);

export const StoreRoutes = router;
