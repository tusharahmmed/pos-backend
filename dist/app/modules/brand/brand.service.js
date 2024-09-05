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
exports.BrandService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const brand_constant_1 = require("./brand.constant");
const createBrand = (user, store_id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // check same store user and insert store_id
    if (user.role === user_1.ENUM_USER_ROLE.STORE_ADMIN && user.store_id !== store_id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    payload.store_id = user.store_id;
    // upload image if have
    if (file) {
        const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        if (!uploadedImage) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image upload failed');
        }
        else {
            payload.image = uploadedImage.secure_url;
        }
    }
    const result = yield prisma_1.default.brand.create({
        data: Object.assign({}, payload),
    });
    return result;
});
const getAllBrands = (user, store_id, options, filters) => __awaiter(void 0, void 0, void 0, function* () {
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
            OR: brand_constant_1.BRAND_SEARCH_FIELDS.map(field => ({
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
    const result = yield prisma_1.default.brand.findMany({
        // filters
        where: whereConditions,
        // pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.brand.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleBrand = (user, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === user_1.ENUM_USER_ROLE.STORE_ADMIN &&
        user.store_id !== params.store_id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    const result = yield prisma_1.default.brand.findUnique({
        where: { id: params.id },
    });
    return result;
});
const updateBrand = (user, params, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // extract store_id can't update
    const { store_id } = payload, updatedData = __rest(payload, ["store_id"]);
    // check same store user and insert store_id
    if (user.role === user_1.ENUM_USER_ROLE.STORE_ADMIN &&
        user.store_id !== params.store_id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    const brandDetails = yield prisma_1.default.brand.findUnique({
        where: { id: params.id },
    });
    if (file && (brandDetails === null || brandDetails === void 0 ? void 0 : brandDetails.image)) {
        const response = yield FileUploadHelper_1.FileUploadHelper.replaceImage(brandDetails.image, file);
        if (!response) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image upload failed');
        }
        updatedData.image = response.secure_url;
    }
    if (file && !(brandDetails === null || brandDetails === void 0 ? void 0 : brandDetails.image)) {
        const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        if (!uploadedImage) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image upload failed');
        }
        else {
            updatedData.image = uploadedImage.secure_url;
        }
    }
    const result = yield prisma_1.default.brand.update({
        where: { id: params.id },
        data: Object.assign({}, updatedData),
    });
    return result;
});
const deleteBrand = (user, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === user_1.ENUM_USER_ROLE.STORE_ADMIN &&
        user.store_id !== params.store_id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const isExistImage = yield tx.brand.findUnique({
            where: { id: params.id },
            select: { image: true },
        });
        if (isExistImage === null || isExistImage === void 0 ? void 0 : isExistImage.image) {
            yield FileUploadHelper_1.FileUploadHelper.destroyToCloudinary(isExistImage.image);
        }
        return yield tx.brand.delete({
            where: { id: params.id },
        });
    }));
    return result;
});
exports.BrandService = {
    createBrand,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand,
};
