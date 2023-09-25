import { HttpException, HttpStatus } from '@nestjs/common';

interface CustomHTTPExceptionInput {
  message: string | Record<string, any>;
  status: number;
}

export class CustomHTTPException extends HttpException {
  constructor(input: CustomHTTPExceptionInput) {
    super(input.message, input.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
