/* eslint-disable no-unused-vars */
import { v2 as cloudinary } from 'cloudinary';
import httpStatus from 'http-status';
import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import config from '../config';
import ApiError from '../errors/ApiError';
import {
  CloudinaryParams,
  // CloudinaryParams,
  ICloudinaryResponse,
  IUploadFile,
} from '../interfaces/file';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

const params: CloudinaryParams = {
  folder: 'pos',
  unique_filename: true,
  allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],

  // transformation: [{ width: 500, height: 500, crop: 'limit' }],
};

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: params,
});

const UPLOAD_FOLDER = './uploads';

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, UPLOAD_FOLDER);
  },
  filename: (req, file, callback) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();

    callback(null, fileName + fileExt);
  },
});

const multerUpload = multer({
  storage: cloudinaryStorage,
  // storage: multerStorage,
  // dest: './uploads',

  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        `Error: File upload only supports the following filetypes - ${filetypes}`
      )
    );
  },
  limits: { fileSize: 1024 * 1024 * 5 },
});

const uploadToCloudinary = async (
  file: IUploadFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const destroyToCloudinary = async (
  secureUrl: string
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const parts = secureUrl.split('/');
    const public_id = parts[parts.length - 1].split('.')[0];
    cloudinary.uploader.destroy(
      public_id,
      (error: Error, result: ICloudinaryResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const replaceImage = async (
  existingSecureUrl: string,
  newFile: IUploadFile
): Promise<ICloudinaryResponse | undefined> => {
  try {
    await destroyToCloudinary(existingSecureUrl);
    return await uploadToCloudinary(newFile);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Image upload failed');
  }
};

export const FileUploadHelper = {
  uploadToCloudinary,
  multerUpload,
  destroyToCloudinary,
  replaceImage,
};
