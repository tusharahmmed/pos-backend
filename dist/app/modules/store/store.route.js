"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRoutes = void 0;
const express_1 = require("express");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const store_controller_1 = require("./store.controller");
const router = (0, express_1.Router)();
router.post('/', FileUploadHelper_1.FileUploadHelper.multerUpload.single('file'), 
// formDataValidation(StoreValidation.createStore),
store_controller_1.StoreController.createStore);
router.patch('/:id', FileUploadHelper_1.FileUploadHelper.multerUpload.single('file'), 
// formDataValidation(StoreValidation.createStore),
store_controller_1.StoreController.updateStore);
router.get('/:id', store_controller_1.StoreController.getSingleStoreById);
router.delete('/:id', store_controller_1.StoreController.deleteStoreById);
router.get('/', store_controller_1.StoreController.getAllStores);
exports.StoreRoutes = router;
