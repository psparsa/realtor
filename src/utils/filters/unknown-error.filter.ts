import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { generateErrorResponse } from 'src/utils/generate-error-response/generate-error-response';

@Catch()
export class UnknownErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;

    if (isHttpException) {
      response.send(exception.getResponse());
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        generateErrorResponse({
          message:
            'Oops! Something went wrong on our end. We are working to fix it. Please try again later.',
        }),
      );
    }
  }
}
