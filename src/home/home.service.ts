import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeFilters, HomeResponseDTO } from './home.dto';
import _ from 'lodash/fp';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: HomeFilters): Promise<HomeResponseDTO[]> {
    const omitNil = _.omitBy(_.isNil);
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },

      where: omitNil({
        city: filters.city
          ? {
              contains: filters.city,
            }
          : undefined,
        price: omitNil({
          gte: filters.minPrice,
          lte: filters.maxPrice,
        }),
        propertyType: filters.propertyType,
      }),
    });

    if (_.isEmpty(homes)) throw new NotFoundException();

    return homes.map((home) => new HomeResponseDTO(home));
  }
}
