"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const billing_controller_1 = require("./billing.controller");
const billing_validation_1 = require("./billing.validation");
const router = (0, express_1.Router)();
router.post('/:store_id', (0, validateRequest_1.default)(billing_validation_1.BillingValidation.createBilling), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STORE_ADMIN), billing_controller_1.BillingController.creatBillingRecord);
router.get('/:store_id/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STORE_ADMIN), billing_controller_1.BillingController.getSingleBillingRecord);
router.get('/:store_id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STORE_ADMIN), billing_controller_1.BillingController.getAllBillingRecords);
exports.BillingRoutes = router;
