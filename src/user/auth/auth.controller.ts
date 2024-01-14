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
import { GenerateProductKeyDTO } from './DTO/GenerateProductKeyDTO';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../user.decorator';
import { SignUpDTO } from './DTO/SignUpDTO';
import { SignInDTO } from './DTO/SignInDTO';

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

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidProductKey = bcrypt.compareSync(
        validProductKey,
        body.productKey,
      );

      if (!isValidProductKey) throw new UnauthorizedException();
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SignInDTO) {
    return this.authService.signin(body);
  }

  @Post('key')
  generateProductKey(@Body() body: GenerateProductKeyDTO) {
    return this.authService.generateProductKey(body.email, body.userType);
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
