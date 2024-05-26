import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { IUploadFile } from '../../../interfaces/file';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
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

export const ProductController = {
  createProduct,
};
