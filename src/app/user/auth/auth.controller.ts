import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseEnumPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import { User, UserInfo } from '../user.decorator';
import { GenerateProductKeyDTO } from './dtos/generate-product-key.dto';
import { SignUpDTO } from './dtos/signup.dto';
import { SignInDTO } from './dtos/signin.dto';
import { errorResponse } from 'src/utils/response';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/i18n.generated';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() body: SignUpDTO,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey)
        throw new BadRequestException(
          errorResponse({
            message: i18n.t('errors.product-key-missing'),
            errors: [
              {
                message: i18n.t('errors.product-key-missing'),
                field: 'productKey',
              },
            ],
          }),
        );

      const isProductKeyValid = this.authService.validateProductKey({
        email: body.email,
        productKey: body.productKey,
        userType,
      });

      if (!isProductKeyValid)
        throw new ForbiddenException(
          errorResponse({
            message: i18n.t('errors.product-key-invalid'),
            errors: [
              {
                message: i18n.t('errors.product-key-invalid'),
                field: 'productKey',
              },
            ],
          }),
        );
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SignInDTO) {
    return this.authService.signin(body);
  }

  @Post('/key')
  generateProductKey(@Body() body: GenerateProductKeyDTO) {
    return this.authService.generateProductKey(body.email, body.userType);
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
