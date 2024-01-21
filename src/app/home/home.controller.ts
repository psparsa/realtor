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
import { generateErrorResponse } from 'src/utils/generate-error-response';

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  private readonly homeIsNotYoursException = new UnauthorizedException(
    generateErrorResponse({
      message: this.i18n.t('errors.home-is-not-yours'),
    }),
  );

  @Get()
  getHomes(
    @Query('city')
    city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
  ) {
    return this.homeService.getHomes({
      city,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      propertyType,
    });
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHome(id);
  }

  @Roles([UserType.REALTOR])
  @UseGuards(RolesGuard)
  @Post()
  createHome(@Body() body: CreateHomeDTO, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
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

    return this.homeService.updateHomeById(body, id);
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
    return this.homeService.deleteHomeById(id);
  }

  @Roles([UserType.BUYER])
  @UseGuards(RolesGuard)
  @Post('/:homeId/inquire')
  inquire(
    @Param('homeId', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() body: InquireDTO,
  ) {
    return this.homeService.inquire(user, homeId, body.message);
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

    return this.homeService.getMessagesByHome(homeId);
  }
}
