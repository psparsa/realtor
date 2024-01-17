import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import { User, UserInfo } from '../user.decorator';
import { GenerateProductKeyDTO } from './dtos/generate-product-key.dto';
import { SignUpDTO } from './dtos/signup.dto';
import { SignInDTO } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignUpDTO,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) throw new UnauthorizedException();

      const isProductKeyValid = this.authService.validateProductKey({
        email: body.email,
        productKey: body.productKey,
        userType,
      });

      if (!isProductKeyValid) throw new UnauthorizedException();
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
