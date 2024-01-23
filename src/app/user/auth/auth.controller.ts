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
import {
  formatErrorResponse,
  formatSuccessResponse,
} from 'src/utils/formatResponse';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/i18n.generated';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignUpDTO,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey)
        throw new BadRequestException(
          formatErrorResponse({
            message: this.i18n.t('errors.product-key-missing'),
            errors: [
              {
                message: this.i18n.t('errors.product-key-missing'),
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
          formatErrorResponse({
            message: this.i18n.t('errors.product-key-invalid'),
            errors: [
              {
                message: this.i18n.t('errors.product-key-invalid'),
                field: 'productKey',
              },
            ],
          }),
        );
    }

    const data = await this.authService.signup(body, userType);
    return formatSuccessResponse({
      message: this.i18n.t('messages.success-signup'),
      data,
    });
  }

  @Post('/signin')
  async signin(@Body() body: SignInDTO) {
    const data = await this.authService.signin(body);
    return formatSuccessResponse({
      message: this.i18n.t('messages.success-signin'),
      data,
    });
  }

  @Post('/key')
  async generateProductKey(@Body() body: GenerateProductKeyDTO) {
    const data = await this.authService.generateProductKey(
      body.email,
      body.userType,
    );

    return formatSuccessResponse({
      message: this.i18n.t('messages.product-key-generated'),
      data,
    });
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return formatSuccessResponse({
      data: user,
    });
  }
}
