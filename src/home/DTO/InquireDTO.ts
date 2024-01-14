import { IsNotEmpty, IsString } from 'class-validator';

export class InquireDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}
