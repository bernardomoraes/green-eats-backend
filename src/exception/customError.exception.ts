import { HttpStatus } from '@nestjs/common';

interface CustomErrorInput {
  message: string | Record<string, any>;
  status: number;
  error?: string;
}

export class CustomError extends Error {
  status: number;
  error?: string;
  constructor(input: CustomErrorInput) {
    super(input.message as string);
    this.status = input.status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.error = input.error || undefined;
  }
}
