import {
  IsEmail,
  IsNotEmpty,
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
}
