"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleClientError = (error) => {
    var _a;
    let errors = [];
    let message = '';
    if (error.code === 'P2025') {
        message = ((_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.cause) || 'Record not found!';
        errors = [{ path: '', message: message }];
    }
    else if (error.code === 'P2003') {
        if (error.message.includes('delete()` invocation:')) {
            message = 'delete failed!';
            errors = [{ path: '', message: message }];
        }
    }
    else if (error.code === 'P2002') {
        if (error.message.includes('create()` invocation:')) {
            message = 'create failed!';
            errors = [{ path: '', message: message }];
        }
    }
    const statusCode = 400;
    return {
        statusCode,
        message,
        errorMessages: errors,
    };
};
exports.default = handleClientError;
