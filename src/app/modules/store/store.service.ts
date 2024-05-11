import { Store } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { STORE_SEARCH_FIELDS } from './store.constant';
import { IStoreFilters } from './store.interface';
import { generateStoreId } from './store.utils';

const createStore = async (payload: Store, file: IUploadFile) => {
  // upload image if have
  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    if (!uploadedImage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    } else {
      payload.logo = uploadedImage.secure_url;
    }
  }

  // generate id
  const id = await generateStoreId();
  payload.id = id;

  const result = await prisma.store.create({
    data: {
      ...payload,
    },
  });

  return result;
};

const getAllStores = async (
  options: IPaginationOptions,
  filters: IStoreFilters
): Promise<IGenericResponse<Store[]>> => {
  // pagination
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // filters
  // const { search, minPrice, maxPrice, category } = filters;
  const { search, ...filterData } = filters;

  const andConditions = [];

  // generate search condition
  if (search) {
    andConditions.push({
      OR: STORE_SEARCH_FIELDS.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  // generate filter condition
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (key === 'userId') {
          return { user: { id: { equals: filterData['userId'] } } };
        }
      }),
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.store.findMany({
    // filters
    where: whereConditions,

    // pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.store.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleStoreById = async (id: string) => {
  const result = await prisma.store.findUnique({
    where: { id },
  });

  return result;
};

const updateStore = async (id: string, payload: Store, file: IUploadFile) => {
  const storeDetails = await prisma.store.findUnique({
    where: { id },
  });

  if (file && storeDetails?.logo) {
    const response = await FileUploadHelper.replaceImage(
      storeDetails.logo,
      file
    );
    if (!response) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    }
    payload.logo = response.secure_url as string;
  }

  if (file && !storeDetails?.logo) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    if (!uploadedImage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    } else {
      payload.logo = uploadedImage.secure_url;
    }
  }

  const result = await prisma.store.update({
    where: { id },
    data: {
      ...payload,
    },
  });

  return result;
};

const deleteStore = async (id: string) => {
  const result = await prisma.$transaction(async tx => {
    const isExistLogo = await tx.store.findUnique({
      where: { id },
      select: { logo: true },
    });

    if (isExistLogo?.logo) {
      await FileUploadHelper.destroyToCloudinary(isExistLogo.logo);
    }
    return await tx.store.delete({
      where: { id },
    });
  });

  return result;
};

export const StoreService = {
  createStore,
  getAllStores,
  getSingleStoreById,
  updateStore,
  deleteStore,
};
