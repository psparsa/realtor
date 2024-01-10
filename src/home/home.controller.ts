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
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDTO } from './home.dto';

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

  @Post()
  createHome(@Body() body: CreateHomeDTO) {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete(':id')
  deleteHome() {
    return {};
  }
}
