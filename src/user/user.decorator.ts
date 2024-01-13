import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface UserInfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
