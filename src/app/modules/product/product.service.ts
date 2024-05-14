import { Product } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { IUploadFile } from '../../../interfaces/file';
import prisma from '../../../shared/prisma';

const createProduct = async (
  user: JwtPayload,
  store_id: string,
  payload: Product,
  file: IUploadFile
) => {
  // check same store user and insert store_id
  if (user.role === ENUM_USER_ROLE.STORE_ADMIN && user.store_id !== store_id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  payload.store_id = user.store_id;

  // upload image if have
  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    if (!uploadedImage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    } else {
      payload.image = uploadedImage.secure_url;
    }
  }

  const result = await prisma.product.create({
    data: {
      ...payload,
    },
  });

  return result;
};

export const ProductService = {
  createProduct,
};
