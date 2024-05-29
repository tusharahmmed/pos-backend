import { Billing } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { asyncForEach, checkStockAvailability } from '../../../shared/utils';
import { IBillingPayload, IPayloadProduct } from './billing.interface';

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

export const BillingService = {
  createBillingRecord,
};
