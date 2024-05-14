import { z } from 'zod';

const creatBrand = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
  }),
  file: z.object({}).optional(),
});

const updateBrand = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
  file: z.object({}).optional(),
});

export const BrandValidation = {
  creatBrand,
  updateBrand,
};
