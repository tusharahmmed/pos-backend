import { Billing } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { IPARAMS_STORE_ID } from '../../../constants/store_id';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach, checkStockAvailability } from '../../../shared/utils';
import { BILLING_SEARCH_FIELDS } from './billing.constant';
import {
  IBillingFilters,
  IBillingPayload,
  IPayloadProduct,
} from './billing.interface';

const createBillingRecord = async (
  user: JwtPayload,
  store_id: string,
  payload: IBillingPayload | Billing
) => {
  if (user.role === ENUM_USER_ROLE.STORE_ADMIN && user.store_id !== store_id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  payload.store_id = user.store_id;

  // seperate items from payload
  const { products, ...bilingData } = payload as IBillingPayload;

  // start transaction
  const result = await prisma.$transaction(async tx => {
    // check available product quantity
    const filterArray: any = [];

    products.map((item: IPayloadProduct) => {
      filterArray.push({
        id: { equals: item.product_id },
      });
    });

    const availableStocks = await tx.product.findMany({
      where: {
        OR: filterArray,
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    const isProductAvailable = checkStockAvailability(
      availableStocks,
      products
    );

    if (!isProductAvailable) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Maximum product quantity  exceeds'
      );
    }

    // insert into billing
    const billingResult = await tx.billing.create({
      data: bilingData as any,
    });

    // update quantity from products
    await asyncForEach(products, async (item: IPayloadProduct) => {
      await tx.product.update({
        where: {
          id: item.product_id,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    });

    // insert int billingProduct
    // eslint-disable-next-line no-unused-vars
    const billingProductResult = await tx.billingProduct.createMany({
      data: products.map((item: IPayloadProduct) => {
        return {
          billing_id: billingResult.id,
          product_id: item.product_id,
          quantity: item.quantity,
        };
      }),
    });

    return await tx.billing.findUnique({
      where: {
        id: billingResult.id,
      },
      include: {
        billing_products: true,
      },
    });
  });
  // end trans

  return result;
};

const getAllBillingRecords = async (
  user: JwtPayload,
  store_id: string,
  options: IPaginationOptions,
  filters: IBillingFilters
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
      OR: BILLING_SEARCH_FIELDS.map(field => ({
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

  const result = await prisma.billing.findMany({
    // filters
    where: whereConditions,

    include: {
      billing_products: {
        include: {
          product: {
            select: {
              title: true,
              image: true,
              price: true,
            },
          },
        },
      },
    },

    // pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.billing.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBillingRecord = async (
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

  const result = await prisma.billing.findUnique({
    // filters
    where: {
      id: params.id,
    },

    include: {
      billing_products: {
        include: {
          product: {
            select: {
              title: true,
              image: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return result;
};

export const BillingService = {
  createBillingRecord,
  getAllBillingRecords,
  getSingleBillingRecord,
};
