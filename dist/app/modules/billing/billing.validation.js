"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingValidation = void 0;
const zod_1 = require("zod");
const product = zod_1.z.object({
    product_id: zod_1.z.string({ required_error: 'product_id is required' }),
    quantity: zod_1.z.number({ required_error: 'quantity is required' }),
});
const createBilling = zod_1.z.object({
    body: zod_1.z.object({
        customer_name: zod_1.z.string({ required_error: 'customer_name is required' }),
        customer_phone: zod_1.z.string({ required_error: 'customer_phone is required' }),
        tax_amount: zod_1.z.number({ required_error: 'tax_amount is required' }),
        total_amount: zod_1.z.number({ required_error: 'total_amount is required' }),
        products: zod_1.z.array(product),
    }),
});
exports.BillingValidation = {
    createBilling,
};
