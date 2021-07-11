import { HttpStatus } from '@nestjs/common';

// Creates a basic javascript error whose error.name property is a string of the passed http status, where http status is a member of the nestjs httpstatus enum or a simple integer.
const makeStatusError = (status: HttpStatus, errorMessage: string): Error => {
  const statusError = new Error(errorMessage);
  statusError.name = status.toString();

  return statusError;
};

export default makeStatusError;
