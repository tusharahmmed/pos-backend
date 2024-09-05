"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
// import { ENUM_USER_ROLE } from '../../../enums/user';
// import auth from '../../middlewares/auth';
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/signup', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.signup), 
// auth(ENUM_USER_ROLE.SUPER_ADMIN),
auth_controller_1.AuthController.signup);
router.post('/signin', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.signin), auth_controller_1.AuthController.signin);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshToken), auth_controller_1.AuthController.refreshToken);
exports.AuthRoutes = router;
