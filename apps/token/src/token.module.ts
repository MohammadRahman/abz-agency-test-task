import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TokenRepository } from './token.repository';
import { AccessToken } from './entity/token.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([AccessToken]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_NAME: Joi.string(),
      }),
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, TokenRepository],
  exports: [TokenService],
})
export class TokenModule {}
