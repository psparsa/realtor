import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber('US')
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsString()
  productKey: string;
}

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class GenerateProductKeyDTO {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
