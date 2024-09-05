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
exports.FileUploadHelper = void 0;
/* eslint-disable no-unused-vars */
const cloudinary_1 = require("cloudinary");
const http_status_1 = __importDefault(require("http-status"));
const multer_1 = __importDefault(require("multer"));
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloudName,
    api_key: config_1.default.cloudinary.apiKey,
    api_secret: config_1.default.cloudinary.apiSecret,
    secure: true,
});
const params = {
    folder: 'pos',
    unique_filename: true,
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    // transformation: [{ width: 500, height: 500, crop: 'limit' }],
};
const cloudinaryStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: params,
});
const UPLOAD_FOLDER = './uploads';
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, UPLOAD_FOLDER);
    },
    filename: (req, file, callback) => {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
            '-' +
            Date.now();
        callback(null, fileName + fileExt);
    },
});
const multerUpload = (0, multer_1.default)({
    storage: cloudinaryStorage,
    // storage: multerStorage,
    // dest: './uploads',
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error(`Error: File upload only supports the following filetypes - ${filetypes}`));
    },
    limits: { fileSize: 1024 * 1024 * 5 },
});
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, (error, result) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
});
const destroyToCloudinary = (secureUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const parts = secureUrl.split('/');
        const public_id = parts[parts.length - 1].split('.')[0];
        cloudinary_1.v2.uploader.destroy(public_id, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
});
const replaceImage = (existingSecureUrl, newFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield destroyToCloudinary(existingSecureUrl);
        return yield uploadToCloudinary(newFile);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Image upload failed');
    }
});
exports.FileUploadHelper = {
    uploadToCloudinary,
    multerUpload,
    destroyToCloudinary,
    replaceImage,
};
