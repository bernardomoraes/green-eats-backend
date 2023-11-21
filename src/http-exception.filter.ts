import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomHTTPException } from './exception/customHTTP.exception';

@Catch(HttpException, CustomHTTPException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log(exception);
    const isCustomException = exception instanceof CustomHTTPException;
    if (isCustomException) {
      const customException = exception as CustomHTTPException;
      response.status(status).json({
        message: customException.message,
      });
      return;
    }

    response.status(status).json({
      message:
        exception.getResponse()?.['message'] ||
        exception.message ||
        'Bad Request',
    });
  }
}
