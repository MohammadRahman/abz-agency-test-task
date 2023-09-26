import { PartialType } from '@nestjs/mapped-types';
import { CreateTokeDto } from './create-token.dto';

export class UpdateTokenDto extends PartialType(CreateTokeDto) {}
