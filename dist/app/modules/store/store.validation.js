"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreValidation = void 0;
const zod_1 = require("zod");
const createStore = zod_1.z.object({
    body: zod_1.z.object({
        data: zod_1.z.object({
            title: zod_1.z.string({ required_error: 'title is required' }),
            logo: zod_1.z.string().optional(),
            product_limit: zod_1.z
                .number({ required_error: 'product_limit is required' })
                .gt(0, 'limit must be greater than 0'),
        }),
    }),
});
exports.StoreValidation = {
    createStore,
};
