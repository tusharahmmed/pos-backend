"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateFormDataRequest = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = JSON.parse(req.body.data);
    // console.log('body', req.body);
    // console.log('file', req.file);
    try {
        yield schema.parseAsync({
            body: req.body,
            file: req === null || req === void 0 ? void 0 : req.file,
            query: req.query,
            params: req.params,
            cookies: req.cookies,
        });
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = validateFormDataRequest;
