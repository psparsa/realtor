import { UserType } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class GenerateProductKeyDTO {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
