import { HttpStatus } from '@nestjs/common';

interface CustomErrorInput {
  message: string;
  status?: number;
  log?: string;
}

export class CustomError extends Error {
  status?: number;
  log?: string;
  constructor(input: CustomErrorInput) {
    super(input.message);
    this.status = input?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.log = input?.log;
  }
}
