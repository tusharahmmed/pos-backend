import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import { PARAMS_STORE_ID } from '../../../constants/store_id';
import { IUploadFile } from '../../../interfaces/file';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CATEGORY_FILTERS_FIELDS } from './category.constant';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const payload = req.body;
  const file = req?.file as any;

  const result = await CategoryService.createCategory(
    user as JwtPayload,
    store_id,
    payload,
    file as IUploadFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category successfully created',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, CATEGORY_FILTERS_FIELDS);

  const result = await CategoryService.getAllCategories(
    user as JwtPayload,
    store_id,
    options,
    filters
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories successfully retrieved',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const user = req.user;
  const params = pick(req.params, PARAMS_STORE_ID);

  const result = await CategoryService.getSingleCategory(
    user as JwtPayload,
    params
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category successfully fetched',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const user = req.user;
  const params = pick(req.params, PARAMS_STORE_ID);
  const payload = req.body;
  const file = req?.file as any;

  const result = await CategoryService.updateCategory(
    user as JwtPayload,
    params,
    payload,
    file
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category successfully updated',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const user = req.user;
  const params = pick(req.params, PARAMS_STORE_ID);

  const result = await CategoryService.deleteCategory(
    user as JwtPayload,
    params
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category successfully deleted',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
