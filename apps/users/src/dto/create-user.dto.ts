import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 60, { message: 'name has to between 2 to 60 chars' })
  name: string;
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    { message: 'not a valid email' },
  )
  email: string;
  @Matches(/^\+380/, { message: 'Phone number must start with +380' })
  @Length(8, 8, { message: 'provide a valid phone number' })
  phone: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Position id must be greater than 0' })
  position_id: number;
  @IsString()
  file: string;
  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  createdAt: Date;
}
