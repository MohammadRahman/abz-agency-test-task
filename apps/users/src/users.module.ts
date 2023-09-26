import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  DatabaseModule,
  MiddlewareModule,
  RedisModule,
  TokenMiddleware,
  UploadsModule,
} from '@app/common';
import { User } from './entity/user.entity';
import { UsersRepository } from './user.repository';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TokenModule } from 'apps/token/src/token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UploadsModule,
    DatabaseModule,
    RedisModule,
    TokenModule,
    PassportModule,
    MiddlewareModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '40min' },
    }),
    DatabaseModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.string(),
        MYSQL_HOST: Joi.string(),
        MYSQL_PORT: Joi.number(),
        MYSQL_DB: Joi.string(),
        MYSQL_USER: Joi.string(),
        DB_TYPE: Joi.string(),
        MYSQL_ROOT_PASSWORD: Joi.string(),
        JWT_SECRET: Joi.string(),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('users/create');
  }
}
