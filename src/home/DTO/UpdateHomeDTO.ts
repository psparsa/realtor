import { PropertyType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateHomeDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}
