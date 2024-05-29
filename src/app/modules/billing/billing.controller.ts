import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
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

export const BillingController = {
  creatBillingRecord,
};
