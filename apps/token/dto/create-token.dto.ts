import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTokeDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsNumber()
  count: number;
}
