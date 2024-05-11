import { USER_ROLE } from '@prisma/client';
import { z } from 'zod';

const signup = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    serName: z.string({ required_error: 'Ser Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    role: z.enum([...Object.values(USER_ROLE)] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    permissions: z
      .array(z.string(), { required_error: 'Permissions is required' })
      .nonempty(),
    phone: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

const signin = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }),
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
