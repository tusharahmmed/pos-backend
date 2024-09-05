"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const creatCategory = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
    }),
    file: zod_1.z.object({}).optional(),
});
const updateCategory = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
    }),
    file: zod_1.z.object({}).optional(),
});
exports.CategoryValidation = {
    creatCategory,
    updateCategory,
};
