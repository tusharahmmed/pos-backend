import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AnylyticsService } from './anylytics.service';

export const getBrandReports = catchAsync(async (req, res) => {
  const { store_id } = req.params;

  const result = await AnylyticsService.getBrandReports(store_id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand reports generated successfully',
    data: result,
  });
});

export const getDailySellsCount = catchAsync(async (req, res) => {
  const { store_id } = req.params;

  const result = await AnylyticsService.getDailySellsCount(store_id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Daily sell reports generated successfully',
    data: result,
  });
});

export const AnylyticsController = { getBrandReports, getDailySellsCount };
