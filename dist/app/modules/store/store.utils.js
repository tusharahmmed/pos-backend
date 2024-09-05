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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStoreId = exports.findLastStoreId = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const findLastStoreId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastStoreId = yield prisma_1.default.store.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return (lastStoreId === null || lastStoreId === void 0 ? void 0 : lastStoreId.id) ? lastStoreId.id.substring(2) : undefined;
});
exports.findLastStoreId = findLastStoreId;
const generateStoreId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastStoreId)()) || (0).toString().padStart(5, '0');
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
    incrementedId = `S-${incrementedId}`;
    return incrementedId;
});
exports.generateStoreId = generateStoreId;
