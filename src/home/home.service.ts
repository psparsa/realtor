import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/user/user.decorator';
import { HomeDTO } from './dtos/home.dto';
import { HomeFilterParameters } from './types/home-filter.parameters';
import { CreateHomeParameters } from './types/create-home.parameters';
import { UpdateHomeParameters } from './types/update-home.parameters';
import _ from 'lodash/fp';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: HomeFilterParameters): Promise<HomeDTO[]> {
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

    return homes.map((home) => new HomeDTO(home));
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

  async createHome(parameters: CreateHomeParameters, UserId: number) {
    const home = await this.prismaService.home.create({
      data: {
        address: parameters.address,
        city: parameters.city,
        land_size: parameters.landSize,
        number_of_bathrooms: parameters.numberOfBathrooms,
        number_of_bedrooms: parameters.numberOfBedrooms,
        price: parameters.price,
        propertyType: parameters.propertyType,
        realtor_id: UserId,
      },
    });

    const images = await this.prismaService.image.create({
      data: {
        url: parameters.images[0].url,
        home_id: home.id,
      },
    });

    return new HomeDTO({ ...home, images: [{ url: images.url }] });
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

    return new HomeDTO(updatedHome);
  }

  async deleteHomeById(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) throw new NotFoundException();

    await this.prismaService.image.deleteMany({
      where: {
        home_id: id,
      },
    });

    await this.prismaService.home.delete({
      where: {
        id,
      },
    });

    return 'Deleted';
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        realtor: true,
      },
    });

    if (!home) throw new NotFoundException();
    return home.realtor;
  }

  async inquire(buyer: UserInfo, homeId: number, message: string) {
    const realtor = await this.getRealtorByHomeId(homeId);

    return await this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        message,
      },
    });
  }

  async getMessagesByHome(homeId: number) {
    return this.prismaService.message.findMany({
      where: {
        home_id: homeId,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }
}
