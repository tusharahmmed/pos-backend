"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnylyticsRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const anylytics_controller_1 = require("./anylytics.controller");
const router = (0, express_1.Router)();
router.get('/brand_reports/:store_id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STORE_ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), anylytics_controller_1.AnylyticsController.getBrandReports);
router.get('/daily_sells/:store_id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STORE_ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), anylytics_controller_1.AnylyticsController.getDailySellsCount);
exports.AnylyticsRoutes = router;
