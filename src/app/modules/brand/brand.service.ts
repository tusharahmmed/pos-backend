/* eslint-disable no-unused-vars */
import { Brand } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { BRAND_SEARCH_FIELDS } from './brand.constant';
import { IBrandFilters, IBrandParams } from './brand.interface';

const createBrand = async (
  user: JwtPayload,
  store_id: string,
  payload: Brand,
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

  const result = await prisma.brand.create({
    data: {
      ...payload,
    },
  });

  return result;
};

const getAllBrands = async (
  user: JwtPayload,
  store_id: string,
  options: IPaginationOptions,
  filters: IBrandFilters
) => {
  // check same store user and insert store_id
  if (user.role === ENUM_USER_ROLE.STORE_ADMIN && user.store_id !== store_id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  // pagination
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // filters
  const { search } = filters;

  const andConditions = [];

  // generate search condition
  if (search) {
    andConditions.push({
      OR: BRAND_SEARCH_FIELDS.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }
  // generate filter BY store_id
  andConditions.push({ AND: [{ store_id: { equals: user.store_id } }] });

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.brand.findMany({
    // filters
    where: whereConditions,

    // pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.brand.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateBrand = async (
  user: JwtPayload,
  params: IBrandParams,
  payload: Brand,
  file: IUploadFile
) => {
  // extract store_id can't update
  const { store_id, ...updatedData } = payload;
  // check same store user and insert store_id
  if (
    user.role === ENUM_USER_ROLE.STORE_ADMIN &&
    user.store_id !== params.store_id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const brandDetails = await prisma.brand.findUnique({
    where: { id: params.id },
  });

  if (file && brandDetails?.image) {
    const response = await FileUploadHelper.replaceImage(
      brandDetails.image,
      file
    );
    if (!response) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    }
    updatedData.image = response.secure_url as string;
  }

  if (file && !brandDetails?.image) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

    if (!uploadedImage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    } else {
      updatedData.image = uploadedImage.secure_url;
    }
  }

  const result = await prisma.brand.update({
    where: { id: params.id },
    data: {
      ...updatedData,
    },
  });

  return result;
};

const deleteBrand = async (user: JwtPayload, params: IBrandParams) => {
  if (
    user.role === ENUM_USER_ROLE.STORE_ADMIN &&
    user.store_id !== params.store_id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const result = await prisma.$transaction(async tx => {
    const isExistImage = await tx.brand.findUnique({
      where: { id: params.id },
      select: { image: true },
    });

    if (isExistImage?.image) {
      await FileUploadHelper.destroyToCloudinary(isExistImage.image);
    }
    return await tx.brand.delete({
      where: { id: params.id },
    });
  });

  return result;
};

export const BrandService = {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
};
