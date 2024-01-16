import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash/fp';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflactor: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflactor.getAllAndOverride('roles', [
      context.getHandler(),
    ]);
    if (_.isEmpty(roles)) return true;

    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')?.[1];

    try {
      const payload = jwt.verify(
        token,
        process.env.JSON_TOKEN_KEY,
      ) as JWTPayload;

      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) return false;
      return roles.includes(user.userType);
    } catch (_) {
      return false;
    }
  }
}
