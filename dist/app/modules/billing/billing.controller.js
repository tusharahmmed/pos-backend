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
exports.BillingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const store_id_1 = require("../../../constants/store_id");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const billing_constant_1 = require("./billing.constant");
const billing_service_1 = require("./billing.service");
const creatBillingRecord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { store_id } = req.params;
    const payload = req.body;
    const result = yield billing_service_1.BillingService.createBillingRecord(user, store_id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Billing successfully created',
        data: result,
    });
}));
const getAllBillingRecords = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { store_id } = req.params;
    const options = (0, pick_1.default)(req.query, pagination_1.PAGINATION_FIELDS);
    const filters = (0, pick_1.default)(req.query, billing_constant_1.BILLING_FILTERS_FIELDS);
    const result = yield billing_service_1.BillingService.getAllBillingRecords(user, store_id, options, filters);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Billings successfully retrieved',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleBillingRecord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const params = (0, pick_1.default)(req.params, store_id_1.PARAMS_STORE_ID);
    const result = yield billing_service_1.BillingService.getSingleBillingRecord(user, params);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Billing successfully retrieved',
        data: result,
    });
}));
exports.BillingController = {
    creatBillingRecord,
    getAllBillingRecords,
    getSingleBillingRecord,
};
