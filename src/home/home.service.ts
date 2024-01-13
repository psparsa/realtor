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

type UpdateHomeParameters = {
  address?: string;
  city?: string;
  landSize?: number;
  numberOfBathrooms?: number;
  numberOfBedrooms?: number;
  price?: number;
  propertyType?: PropertyType;
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

  async createHome(parameters: CreateHomeParameters) {
    const home = await this.prismaService.home.create({
      data: {
        address: parameters.address,
        city: parameters.city,
        land_size: parameters.landSize,
        number_of_bathrooms: parameters.numberOfBathrooms,
        number_of_bedrooms: parameters.numberOfBedrooms,
        price: parameters.price,
        propertyType: parameters.propertyType,
        realtor_id: 10,
      },
    });

    const images = await this.prismaService.image.create({
      data: {
        url: parameters.images[0].url,
        home_id: home.id,
      },
    });

    return new HomeResponseDTO({ ...home, images: [{ url: images.url }] });
  }

  async updateHomeById(parameters: UpdateHomeParameters, id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) throw new NotFoundException();

    const updatedHome = await this.prismaService.home.update({
      where: {
        id,
      },
      data: parameters,
    });

    return new HomeResponseDTO(updatedHome);
  }
}
