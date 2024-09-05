"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const creatProduct = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        price: zod_1.z
            .number({ required_error: 'price is required' })
            .nonnegative("price can't be negative")
            .gt(0),
        quantity: zod_1.z
            .number({ required_error: 'quantity is required' })
            .nonnegative(),
        category_id: zod_1.z.string({ required_error: 'category_id is required' }),
        brand_id: zod_1.z.string({ required_error: 'brand_id is required' }),
    }),
    file: zod_1.z.object({}, { required_error: 'Product image is required' }),
});
const updateProduct = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        price: zod_1.z.number().nonnegative().optional(),
        quantity: zod_1.z.number().nonnegative().optional(),
        category_id: zod_1.z.string().optional(),
        brand_id: zod_1.z.string().optional(),
    }),
    file: zod_1.z.object({}).optional(),
});
exports.ProductValidation = {
    creatProduct,
    updateProduct,
};
