import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import { IUploadFile } from '../../../interfaces/file';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { STORE_FILTERS_FIELDS } from './store.constant';
import { StoreService } from './store.service';

const createStore = catchAsync(async (req, res) => {
  const { data } = req.body;
  const file = req?.file as any;
  const result = await StoreService.createStore(
    JSON.parse(data),
    file as IUploadFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store successfully created',
    data: result,
  });
});

const getAllStores = catchAsync(async (req, res) => {
  const options = pick(req.query, PAGINATION_FIELDS);

  const filters = pick(req.query, STORE_FILTERS_FIELDS);

  const result = await StoreService.getAllStores(options, filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Stores successfully retrieved',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleStoreById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StoreService.getSingleStoreById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Store successfully retrieved',
    data: result,
  });
});

const updateStore = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const file = req?.file as any;

  const result = await StoreService.updateStore(id, JSON.parse(data), file);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Store successfully updated',
    data: result,
  });
});

const deleteStoreById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StoreService.deleteStore(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Store successfully deleted',
    data: result,
  });
});

export const StoreController = {
  createStore,
  getAllStores,
  updateStore,
  deleteStoreById,
  getSingleStoreById,
};
