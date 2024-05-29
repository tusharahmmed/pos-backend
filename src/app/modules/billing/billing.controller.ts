import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BILLING_FILTERS_FIELDS } from './billing.constant';
import { BillingService } from './billing.service';

const creatBillingRecord = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const payload = req.body;

  const result = await BillingService.createBillingRecord(
    user as JwtPayload,
    store_id,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billing successfully created',
    data: result,
  });
});

const getAllBillingRecords = catchAsync(async (req, res) => {
  const user = req.user;
  const { store_id } = req.params;
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, BILLING_FILTERS_FIELDS);

  const result = await BillingService.getAllBillingRecords(
    user as JwtPayload,
    store_id,
    options,
    filters
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Billings successfully retrieved',
    meta: result.meta,
    data: result.data,
  });
});

export const BillingController = {
  creatBillingRecord,
  getAllBillingRecords,
};
