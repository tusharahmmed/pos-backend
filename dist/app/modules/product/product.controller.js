"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const store_id_1 = require("../../../constants/store_id");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const product_constant_1 = require("./product.constant");
const product_service_1 = require("./product.service");
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { store_id } = req.params;
    const payload = req.body;
    const file = req === null || req === void 0 ? void 0 : req.file;
    // console.table(payload);
    // console.log(file);
    const result = yield product_service_1.ProductService.createProduct(user, store_id, payload, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product successfully created',
        data: result,
    });
}));
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { store_id } = req.params;
    const options = (0, pick_1.default)(req.query, pagination_1.PAGINATION_FIELDS);
    const filters = (0, pick_1.default)(req.query, product_constant_1.PRODUCT_FILTERS_FIELDS);
    const result = yield product_service_1.ProductService.getAllProducts(user, store_id, options, filters);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Product successfully retrieved',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const params = (0, pick_1.default)(req.params, store_id_1.PARAMS_STORE_ID);
    const result = yield product_service_1.ProductService.getSingleProduct(user, params);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Product successfully retrieved',
        data: result,
    });
}));
const deleteSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const params = (0, pick_1.default)(req.params, store_id_1.PARAMS_STORE_ID);
    const result = yield product_service_1.ProductService.deleteSingleProduct(user, params);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Product successfully deleted',
        data: result,
    });
}));
const updateSingeProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const params = (0, pick_1.default)(req.params, store_id_1.PARAMS_STORE_ID);
    const payload = req.body;
    const file = req === null || req === void 0 ? void 0 : req.file;
    const result = yield product_service_1.ProductService.updateSingeProduct(user, params, payload, file);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Product successfully updated',
        data: result,
    });
}));
exports.ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteSingleProduct,
    updateSingeProduct,
};
