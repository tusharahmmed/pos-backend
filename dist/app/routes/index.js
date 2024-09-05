"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const anylytics_route_1 = require("../modules/analytics/anylytics.route");
const auth_route_1 = require("../modules/auth/auth.route");
const billing_router_1 = require("../modules/billing/billing.router");
const brand_route_1 = require("../modules/brand/brand.route");
const category_route_1 = require("../modules/category/category.route");
const product_route_1 = require("../modules/product/product.route");
const store_route_1 = require("../modules/store/store.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/stores',
        route: store_route_1.StoreRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/brands',
        route: brand_route_1.BrandRoutes,
    },
    {
        path: '/products',
        route: product_route_1.ProductRoutes,
    },
    {
        path: '/billings',
        route: billing_router_1.BillingRoutes,
    },
    {
        path: '/anylytics',
        route: anylytics_route_1.AnylyticsRoutes,
    },
];
moduleRoutes.forEach(module => router.use(module.path, module.route));
exports.applicationRoutes = router;
