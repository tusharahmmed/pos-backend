import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from '../interfaces/error';

const handleClientError = (error: Prisma.PrismaClientKnownRequestError) => {
  let errors: IGenericErrorMessage[] = [];

  let message = '';

  if (error.code === 'P2025') {
    message = (error?.meta?.cause as string) || 'Record not found!';
    errors = [{ path: '', message: message }];
  } else if (error.code === 'P2003') {
    if (error.message.includes('delete()` invocation:')) {
      message = 'delete failed!';
      errors = [{ path: '', message: message }];
    }
  } else if (error.code === 'P2002') {
    if (error.message.includes('create()` invocation:')) {
      message = 'create failed!';
      errors = [{ path: '', message: message }];
    }
  }

  const statusCode = 400;
  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleClientError;
