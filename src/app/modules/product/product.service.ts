import { Product } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { IPARAMS_STORE_ID } from '../../../constants/store_id';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { PRODUCT_SEARCH_FIELDS } from './product.constant';
import { IProductFilters } from './product.interface';

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

const getAllProducts = async (
  user: JwtPayload,
  store_id: string,
  options: IPaginationOptions,
  filters: IProductFilters
) => {
  // check same store user and insert store_id
  if (user.role === ENUM_USER_ROLE.STORE_ADMIN && user.store_id !== store_id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  // pagination
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // filters
  const { search, ...filterData } = filters;

  const andConditions = [];

  // generate search condition
  if (search) {
    andConditions.push({
      OR: PRODUCT_SEARCH_FIELDS.map(field => {
        if (field === 'title') {
          return {
            [field]: {
              contains: search,
              mode: 'insensitive',
            },
          };
        }
        if (field === 'brand') {
          return {
            brand: { title: { contains: search, mode: 'insensitive' } },
          };
        }
        if (field === 'category') {
          return {
            category: { title: { contains: search, mode: 'insensitive' } },
          };
        }
      }),
    });
  }
  // generate filter BY store_id
  const filterArray: any = [{ store_id: { equals: user.store_id } }];

  // generate filter condition
  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).map(key => {
      filterArray.push({
        [key]: {
          equals: (filterData as any)[key],
        },
      });
    });
  }

  andConditions.push({ AND: filterArray });

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    // filters
    where: whereConditions,

    include: {
      brand: { select: { title: true } },
      category: { select: { title: true } },
    },

    // pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.product.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProduct = async (user: JwtPayload, params: IPARAMS_STORE_ID) => {
  // check same store user and insert store_id
  if (
    user.role === ENUM_USER_ROLE.STORE_ADMIN &&
    user.store_id !== params.store_id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const result = await prisma.product.findUnique({
    // filters
    where: {
      id: params.id,
    },

    include: {
      brand: { select: { title: true } },
      category: { select: { title: true } },
    },
  });

  return result;
};

const deleteSingleProduct = async (
  user: JwtPayload,
  params: IPARAMS_STORE_ID
) => {
  // check same store user and insert store_id
  if (
    user.role === ENUM_USER_ROLE.STORE_ADMIN &&
    user.store_id !== params.store_id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const result = await prisma.$transaction(async tx => {
    const isExistImage = await tx.product.findUnique({
      where: { id: params.id },
      select: { image: true },
    });

    if (isExistImage?.image) {
      await FileUploadHelper.destroyToCloudinary(isExistImage.image);
    }
    return await tx.product.delete({
      where: { id: params.id },
    });
  });

  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteSingleProduct,
};
