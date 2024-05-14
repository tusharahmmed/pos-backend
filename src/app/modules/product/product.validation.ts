import { z } from 'zod';

const creatProduct = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    price: z
      .number({ required_error: 'price is required' })
      .nonnegative("price can't be negative")
      .gt(0),
    quantity: z
      .number({ required_error: 'quantity is required' })
      .nonnegative(),
    category_id: z.string({ required_error: 'category_id is required' }),
    brand_id: z.string({ required_error: 'brand_id is required' }),
  }),
  file: z.object({}, { required_error: 'Product image is required' }),
});

const updateProduct = z.object({
  body: z.object({
    title: z.string().optional(),
    price: z.number().nonnegative().optional(),
    quantity: z.number().nonnegative().optional(),
    category_id: z.string().optional(),
    brand_id: z.string().optional(),
  }),
  file: z.object({}).optional(),
});

export const ProductValidation = {
  creatProduct,
  updateProduct,
};
