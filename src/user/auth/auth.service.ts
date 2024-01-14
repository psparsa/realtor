import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { SignInDTO } from './DTO/SignInDTO';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { SignUpDTO } from './DTO/SignUpDTO';

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
    { email, password, name, phone }: SignUpDTO,
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

  async signin({ email, password }: SignInDTO) {
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
}
