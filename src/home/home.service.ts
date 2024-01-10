import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeFilters, HomeResponseDTO } from './home.dto';
import _ from 'lodash/fp';
import { PropertyType } from '@prisma/client';

type CreateHomeParameters = {
  address: string;
  city: string;
  landSize: number;
  numberOfBathrooms: number;
  numberOfBedrooms: number;
  price: number;
  propertyType: PropertyType;
  images: Array<Record<'url', string>>;
};

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

  async getHome(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });

    if (home) return home;
    throw new NotFoundException();
  }

  async createHome(data: CreateHomeParameters) {
    const home = await this.prismaService.home.create({
      data: {
        address: data.address,
        city: data.city,
        land_size: data.landSize,
        number_of_bathrooms: data.numberOfBathrooms,
        number_of_bedrooms: data.numberOfBedrooms,
        price: data.price,
        propertyType: data.propertyType,
        realtor_id: 10,
      },
    });

    const images = await this.prismaService.image.create({
      data: {
        url: data.images[0].url,
        home_id: home.id,
      },
    });

    return new HomeResponseDTO({ ...home, images: [{ url: images.url }] });
  }
}
