import { z } from 'zod';

const product = z.object({
  product_id: z.string({ required_error: 'product_id is required' }),
  quantity: z.number({ required_error: 'quantity is required' }),
});

const createBilling = z.object({
  body: z.object({
    customer_name: z.string({ required_error: 'customer_name is required' }),
    customer_phone: z.string({ required_error: 'customer_phone is required' }),
    tax_amount: z.number({ required_error: 'tax_amount is required' }),
    total_amount: z.number({ required_error: 'total_amount is required' }),
    products: z.array(product),
  }),
});

export const BillingValidation = {
  createBilling,
};
