import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { SignUpParameters } from './types/signup.parameters';
import { SignInParameters } from './types/signin.parameters';
import { ValidateProductKeyParameters } from './types/validate-product-key.parameters';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  generateToken(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      { expiresIn: 60 * 60 },
    );
  }

  async signup(
    { email, password, name, phone }: SignUpParameters,
    userType: UserType,
  ) {
    const userExists = !!(await this.prismaService.user.findUnique({
      where: {
        email,
      },
    }));

    if (userExists) throw new ConflictException();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        userType,
      },
    });

    return {
      token: this.generateToken(name, createdUser.id),
    };
  }

  async signin({ email, password }: SignInParameters) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException("User didn't found!", 400);

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) throw new HttpException('Invalid credentials!', 400);

    return {
      token: this.generateToken(user.name, user.id),
    };
  }

  async generateProductKey(email: string, userType: UserType) {
    const str = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(str, 10);
  }

  validateProductKey(parameters: ValidateProductKeyParameters) {
    const validProductKey = `${parameters.email}-${parameters.userType}-${process.env.PRODUCT_KEY_SECRET}`;

    return bcrypt.compareSync(validProductKey, parameters.productKey);
  }
}