"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidation = void 0;
const zod_1 = require("zod");
const creatBrand = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
    }),
    file: zod_1.z.object({}).optional(),
});
const updateBrand = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
    }),
    file: zod_1.z.object({}).optional(),
});
exports.BrandValidation = {
    creatBrand,
    updateBrand,
};
