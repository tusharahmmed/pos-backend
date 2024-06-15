import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import { PARAMS_STORE_ID } from '../../../constants/store_id';
import { IUploadFile } from '../../../interfaces/file';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BRAND_FILTERS_FIELDS } from './brand.constant';
import { BrandService } from './brand.service';

const createBrand = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const payload = req.body;
  const file = req?.file as any;

  const result = await BrandService.createBrand(
    user as JwtPayload,
    store_id,
    payload,
    file as IUploadFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand successfully created',
    data: result,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, BRAND_FILTERS_FIELDS);

  const result = await BrandService.getAllBrands(
    user as JwtPayload,
    store_id,
    options,
    filters
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brands successfully retrieved',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBrand = catchAsync(async (req, res) => {
  const user = req.user;
  const params = pick(req.params, PARAMS_STORE_ID);

  const result = await BrandService.getSingleBrand(user as JwtPayload, params);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand successfully deleted',
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const user = req.user;
  const params = pick(req.params, PARAMS_STORE_ID);
  const payload = req.body;
  const file = req?.file as any;

  const result = await BrandService.updateBrand(
    user as JwtPayload,
    params,
    payload,
    file
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand successfully updated',
    data: result,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const user = req.user;
  const params = pick(req.params, PARAMS_STORE_ID);

  const result = await BrandService.deleteBrand(user as JwtPayload, params);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand successfully fetched',
    data: result,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
