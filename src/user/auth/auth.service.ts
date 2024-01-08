import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDTO } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email, password, name, phone }: SignUpDTO) {
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
        userType: UserType.BUYER,
      },
    });

    const token = jwt.sign(
      {
        name,
        id: createdUser.id,
      },
      process.env.JSON_TOKEN_KEY,
      { expiresIn: 60 * 60 },
    );

    return {
      token,
    };
  }
}
