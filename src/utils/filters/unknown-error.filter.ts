import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import { errorResponse } from 'src/utils/response';

@Catch()
export class UnknownErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const i18n = I18nContext.current<I18nTranslations>();
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;

    if (isHttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        errorResponse({
          message: i18n.t('errors.unknown-server-error'),
        }),
      );
    }
  }
}
