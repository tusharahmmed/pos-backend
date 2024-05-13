import { z } from 'zod';

const creatCategory = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
  }),
  file: z.object({}).optional(),
});

const updateCategory = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
  file: z.object({}).optional(),
});

export const CategoryValidation = {
  creatCategory,
  updateCategory,
};
