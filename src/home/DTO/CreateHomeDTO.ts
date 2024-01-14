import { PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDTO {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  landSize: number;
  @IsEnum(PropertyType)
  propertyType: PropertyType;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}
