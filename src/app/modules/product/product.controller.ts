import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import { IUploadFile } from '../../../interfaces/file';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { PRODUCT_FILTERS_FIELDS } from './product.constant';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const payload = req.body;
  const file = req?.file as any;

  // console.table(payload);
  // console.log(file);

  const result = await ProductService.createProduct(
    user as JwtPayload,
    store_id,
    payload,
    file as IUploadFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product successfully created',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, PRODUCT_FILTERS_FIELDS);

  const result = await ProductService.getAllProducts(
    user as JwtPayload,
    store_id,
    options,
    filters
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product successfully retrieved',
    meta: result.meta,
    data: result.data,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
};
