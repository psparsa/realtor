import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { User, UserInfo } from 'src/app/user/user.decorator';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { UserType } from '@prisma/client';

import { CreateHomeDTO } from './dtos/create-home.dto';
import { UpdateHomeDTO } from './dtos/update-home.dto';
import { InquireDTO } from './dtos/inquire.dto';
import { RolesGuard } from '../user/auth/guards/roles.guard';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import { errorResponse, successResponse } from 'src/utils/response';

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  private readonly homeIsNotYoursException = new UnauthorizedException(
    errorResponse({
      message: this.i18n.t('errors.home-is-not-yours'),
    }),
  );

  @Get()
  async getHomes(
    @Query('city')
    city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
  ) {
    const data = await this.homeService.getHomes({
      city,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      propertyType,
    });

    return successResponse({
      data,
    });
  }

  @Get(':id')
  async getHome(@Param('id', ParseIntPipe) id: number) {
    const data = await this.homeService.getHome(id);
    return successResponse({ data });
  }

  @Roles([UserType.REALTOR])
  @UseGuards(RolesGuard)
  @Post()
  async createHome(@Body() body: CreateHomeDTO, @User() user: UserInfo) {
    const data = await this.homeService.createHome(body, user.id);

    return successResponse({
      data,
    });
  }

  @Roles([UserType.REALTOR])
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) throw this.homeIsNotYoursException;

    const data = await this.homeService.updateHomeById(body, id);
    return successResponse({ data });
  }

  @Roles([UserType.REALTOR, UserType.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) throw this.homeIsNotYoursException;
    const data = await this.homeService.deleteHomeById(id);
    return successResponse({ data });
  }

  @Roles([UserType.BUYER])
  @UseGuards(RolesGuard)
  @Post('/:homeId/inquire')
  async inquire(
    @Param('homeId', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() body: InquireDTO,
  ) {
    const data = await this.homeService.inquire(user, homeId, body.message);
    return successResponse({
      data,
    });
  }

  @Roles([UserType.REALTOR])
  @UseGuards(RolesGuard)
  @Get('/:homeId/messages')
  async getHomeMessages(
    @Param('homeId', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(homeId);
    if (realtor.id !== user.id) throw this.homeIsNotYoursException;
    const data = this.homeService.getMessagesByHome(homeId);
    return successResponse({
      data,
    });
  }
}
