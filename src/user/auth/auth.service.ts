import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDTO } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email }: SignUpDTO) {
    const userExists = !!(await this.prismaService.user.findUnique({
      where: {
        email,
      },
    }));

    if (userExists) throw new ConflictException();
  }
}
