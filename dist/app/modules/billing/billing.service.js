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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const billing_constant_1 = require("./billing.constant");
const createBillingRecord = (user, store_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === user_1.ENUM_USER_ROLE.STORE_ADMIN && user.store_id !== store_id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    payload.store_id = user.store_id;
    // seperate items from payload
    const _a = payload, { products } = _a, bilingData = __rest(_a, ["products"]);
    // start transaction
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // check available product quantity
        const filterArray = [];
        products.map((item) => {
            filterArray.push({
                id: { equals: item.product_id },
            });
        });
        const availableStocks = yield tx.product.findMany({
            where: {
                OR: filterArray,
            },
            select: {
                id: true,
                quantity: true,
            },
        });
        const isProductAvailable = (0, utils_1.checkStockAvailability)(availableStocks, products);
        if (!isProductAvailable) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Maximum product quantity  exceeds');
        }
        // insert into billing
        const billingResult = yield tx.billing.create({
            data: bilingData,
        });
        // update quantity from products
        yield (0, utils_1.asyncForEach)(products, (item) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.product.update({
                where: {
                    id: item.product_id,
                },
                data: {
                    quantity: {
                        decrement: item.quantity,
                    },
                },
            });
        }));
        // insert int billingProduct
        // eslint-disable-next-line no-unused-vars
        const billingProductResult = yield tx.billingProduct.createMany({
            data: products.map((item) => {
                return {
                    billing_id: billingResult.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                };
            }),
        });
        return yield tx.billing.findUnique({
            where: {
                id: billingResult.id,
            },
            include: {
                billing_products: true,
            },
        });
    }));
    // end trans
    return result;
});
const getAllBillingRecords = (user, store_id, options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // check same store user and insert store_id
    if (user.role === user_1.ENUM_USER_ROLE.STORE_ADMIN && user.store_id !== store_id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    // pagination
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // filters
    const { search } = filters;
    const andConditions = [];
    // generate search condition
    if (search) {
        andConditions.push({
            OR: billing_constant_1.BILLING_SEARCH_FIELDS.map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // generate filter BY store_id
    andConditions.push({ AND: [{ store_id: { equals: user.store_id } }] });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.billing.findMany({
        // filters
        where: whereConditions,
        include: {
            billing_products: {
                include: {
                    product: {
                        select: {
                            title: true,
                            image: true,
                            price: true,
                        },
                    },
                },
            },
        },
        // pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.billing.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleBillingRecord = (user, params) => __awaiter(void 0, void 0, void 0, function* () {
    // check same store user and insert store_id
    if (user.role === user_1.ENUM_USER_ROLE.STORE_ADMIN &&
        user.store_id !== params.store_id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    const result = yield prisma_1.default.billing.findUnique({
        // filters
        where: {
            id: params.id,
        },
        include: {
            billing_products: {
                include: {
                    product: {
                        select: {
                            title: true,
                            image: true,
                            price: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
exports.BillingService = {
    createBillingRecord,
    getAllBillingRecords,
    getSingleBillingRecord,
};
