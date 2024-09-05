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
exports.StoreService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const store_constant_1 = require("./store.constant");
const store_utils_1 = require("./store.utils");
const createStore = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // upload image if have
    if (file) {
        const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        if (!uploadedImage) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image upload failed');
        }
        else {
            payload.logo = uploadedImage.secure_url;
        }
    }
    // generate id
    const id = yield (0, store_utils_1.generateStoreId)();
    payload.id = id;
    const result = yield prisma_1.default.store.create({
        data: Object.assign({}, payload),
    });
    return result;
});
const getAllStores = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // filters
    // const { search, minPrice, maxPrice, category } = filters;
    const { search } = filters, filterData = __rest(filters, ["search"]);
    const andConditions = [];
    // generate search condition
    if (search) {
        andConditions.push({
            OR: store_constant_1.STORE_SEARCH_FIELDS.map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // generate filter condition
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (key === 'userId') {
                    return { user: { id: { equals: filterData['userId'] } } };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.store.findMany({
        // filters
        where: whereConditions,
        // pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.store.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleStoreById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.store.findUnique({
        where: { id },
    });
    return result;
});
const updateStore = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const storeDetails = yield prisma_1.default.store.findUnique({
        where: { id },
    });
    if (file && (storeDetails === null || storeDetails === void 0 ? void 0 : storeDetails.logo)) {
        const response = yield FileUploadHelper_1.FileUploadHelper.replaceImage(storeDetails.logo, file);
        if (!response) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image upload failed');
        }
        payload.logo = response.secure_url;
    }
    if (file && !(storeDetails === null || storeDetails === void 0 ? void 0 : storeDetails.logo)) {
        const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        if (!uploadedImage) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image upload failed');
        }
        else {
            payload.logo = uploadedImage.secure_url;
        }
    }
    const result = yield prisma_1.default.store.update({
        where: { id },
        data: Object.assign({}, payload),
    });
    return result;
});
const deleteStore = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const isExistLogo = yield tx.store.findUnique({
            where: { id },
            select: { logo: true },
        });
        if (isExistLogo === null || isExistLogo === void 0 ? void 0 : isExistLogo.logo) {
            yield FileUploadHelper_1.FileUploadHelper.destroyToCloudinary(isExistLogo.logo);
        }
        return yield tx.store.delete({
            where: { id },
        });
    }));
    return result;
});
exports.StoreService = {
    createStore,
    getAllStores,
    getSingleStoreById,
    updateStore,
    deleteStore,
};
