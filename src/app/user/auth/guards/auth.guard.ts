import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import { I18nContext } from 'nestjs-i18n';
import { formatErrorResponse } from 'src/utils/formatResponse';
import { User } from '@prisma/client';

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
    const i18n = I18nContext.current<I18nTranslations>();
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')?.[1];

    if (!token)
      throw new UnauthorizedException(
        formatErrorResponse({
          message: i18n.t('errors.provide-token'),
        }),
      );

    let user: User;
    try {
      const jwtPayload = jwt.verify(
        token,
        process.env.JSON_TOKEN_KEY,
      ) as JWTPayload;

      user = await this.prismaService.user.findUnique({
        where: {
          id: jwtPayload.id,
        },
      });

      // To trigger catch block!
      if (!user) throw Error('');
    } catch (_) {
      throw new BadRequestException(
        formatErrorResponse({
          message: i18n.t('errors.provide-valid-token'),
        }),
      );
    }

    return true;
  }
}
