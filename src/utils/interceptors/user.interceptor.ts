import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')?.[1];
    if (token) {
      const user = jwt.decode(token);
      Reflect.set(request, 'user', user);
    }

    return handler.handle();
  }
}
