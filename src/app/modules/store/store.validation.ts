import { z } from 'zod';

const createStore = z.object({
  body: z.object({
    data: z.object({
      title: z.string({ required_error: 'title is required' }),
      logo: z.string().optional(),
      product_limit: z
        .number({ required_error: 'product_limit is required' })
        .gt(0, 'limit must be greater than 0'),
    }),
  }),
});

export const StoreValidation = {
  createStore,
};
