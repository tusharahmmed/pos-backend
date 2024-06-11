/* eslint-disable no-unused-vars */
import { Category } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { CATEGORY_SEARCH_FIELDS } from './category.constant';
import { ICategoryFilters, ICategoryParams } from './category.interface';

const createCategory = async (
  user: JwtPayload,
  store_id: string,
  payload: Category,
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

  const result = await prisma.category.create({
    data: {
      ...payload,
    },
  });

  return result;
};

const getAllCategories = async (
  user: JwtPayload,
  store_id: string,
  options: IPaginationOptions,
  filters: ICategoryFilters
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
      OR: CATEGORY_SEARCH_FIELDS.map(field => ({
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

  const result = await prisma.category.findMany({
    // filters
    where: whereConditions,

    // pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.category.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCategory = async (user: JwtPayload, params: ICategoryParams) => {
  // check same store user and insert store_id
  if (
    user.role === ENUM_USER_ROLE.STORE_ADMIN &&
    user.store_id !== params.store_id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const result = await prisma.category.findUnique({
    where: { id: params.id },
  });

  return result;
};

const updateCategory = async (
  user: JwtPayload,
  params: ICategoryParams,
  payload: Category,
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

  const categoryDetails = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (file && categoryDetails?.image) {
    const response = await FileUploadHelper.replaceImage(
      categoryDetails.image,
      file
    );
    if (!response) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    }
    updatedData.image = response.secure_url as string;
  }

  if (file && !categoryDetails?.image) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

    if (!uploadedImage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    } else {
      updatedData.image = uploadedImage.secure_url;
    }
  }

  const result = await prisma.category.update({
    where: { id: params.id },
    data: {
      ...updatedData,
    },
  });

  return result;
};

const deleteCategory = async (user: JwtPayload, params: ICategoryParams) => {
  if (
    user.role === ENUM_USER_ROLE.STORE_ADMIN &&
    user.store_id !== params.store_id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const result = await prisma.$transaction(async tx => {
    const isExistImage = await tx.category.findUnique({
      where: { id: params.id },
      select: { image: true },
    });

    if (isExistImage?.image) {
      await FileUploadHelper.destroyToCloudinary(isExistImage.image);
    }
    return await tx.category.delete({
      where: { id: params.id },
    });
  });

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getSingleCategory,
};
