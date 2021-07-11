import { HttpException, HttpStatus } from '@nestjs/common';

const makeHttpErrorResponse = (
  status: HttpStatus,
  error: any,
): HttpException => {
  return new HttpException(
    {
      status,
      error,
    },
    status,
  );
};

export default makeHttpErrorResponse;
