import { IsArray } from 'class-validator';

export class CreateTokenDto {
  @IsArray()
  tokens: Array<{ value: string; count: number }>;
}
