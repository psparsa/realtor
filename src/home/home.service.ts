import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDTO } from './home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(): Promise<HomeResponseDTO[]> {
    const homes = await this.prismaService.home.findMany();

    return homes.map((home) => new HomeResponseDTO(home));
  }
}
