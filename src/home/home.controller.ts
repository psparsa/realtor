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
import { CreateHomeDTO, InquireDTO, UpdateHomeDTO } from './home.dto';
import { User, UserInfo } from 'src/user/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/roles.decorator';
import { UserType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

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
  @UseGuards(AuthGuard)
  @Post()
  createHome(@Body() body: CreateHomeDTO, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles([UserType.REALTOR])
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) throw new UnauthorizedException();
    return this.homeService.updateHomeById(body, id);
  }

  @Roles([UserType.REALTOR, UserType.ADMIN])
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) throw new UnauthorizedException();
    return this.homeService.deleteHomeById(id);
  }

  @Roles([UserType.BUYER])
  @UseGuards(AuthGuard)
  @Post('/:homeId/inquire')
  inquire(
    @Param('homeId', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() body: InquireDTO,
  ) {
    return this.homeService.inquire(user, homeId, body.message);
  }

  @UseGuards(AuthGuard)
  @Roles([UserType.REALTOR])
  @Get('/:homeId/messages')
  async getHomeMessages(
    @Param('homeId', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(homeId);
    if (!realtor) throw new Error('What?!');
    if (realtor.id !== user.id) throw new UnauthorizedException();

    return this.homeService.getMessagesByHome(homeId);
  }
}
