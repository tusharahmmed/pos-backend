import { z } from 'zod';
import { ENUM_USER_ROLE } from '../../../enums/user';

const signup = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    phone: z.string({ required_error: 'phone is required' }),
    role: z.enum([ENUM_USER_ROLE.STORE_ADMIN], {
      required_error: 'Role is required',
    }),
    store_id: z.string({ required_error: 'Store id is required' }),
  }),
});

const signin = z.object({
  body: z.object({
    store_id: z.string({ required_error: 'store_id is required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});

const refreshToken = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

export const AuthValidation = {
  signup,
  signin,
  refreshToken,
};
