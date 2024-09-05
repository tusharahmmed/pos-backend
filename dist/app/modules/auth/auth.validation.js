"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const user_1 = require("../../../enums/user");
const signup = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        phone: zod_1.z.string({ required_error: 'phone is required' }),
        role: zod_1.z.enum([user_1.ENUM_USER_ROLE.STORE_ADMIN], {
            required_error: 'Role is required',
        }),
        store_id: zod_1.z.string({ required_error: 'Store id is required' }),
    }),
});
const signin = zod_1.z.object({
    body: zod_1.z.object({
        store_id: zod_1.z.string({ required_error: 'store_id is required' }),
        password: zod_1.z.string({ required_error: 'password is required' }),
    }),
});
const refreshToken = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
exports.AuthValidation = {
    signup,
    signin,
    refreshToken,
};
