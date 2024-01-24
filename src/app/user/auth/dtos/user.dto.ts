import { UserType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UserDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsPhoneNumber('US')
  phone: string;

  @IsEmail()
  email: string;

  @Exclude()
  created_at: Date;
  @Expose({
    name: 'createdAt',
  })
  getCreatedAt() {
    return this.created_at;
  }

  @Exclude()
  updated_at: Date;
  @Expose({ name: 'updatedAt' })
  getUpdatedAt() {
    return this.updated_at;
  }

  @IsEnum(UserType)
  userType: UserType;

  @Exclude()
  password: string;

  constructor(data: Partial<UserDTO>) {
    Object.assign(this, data);
  }
}
