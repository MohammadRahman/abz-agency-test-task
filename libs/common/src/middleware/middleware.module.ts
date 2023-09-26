import { Module } from '@nestjs/common';
import { TokenMiddleware } from './middleware.service';
import { TokenModule } from 'apps/token/src/token.module';

@Module({
  imports: [TokenModule],
  providers: [TokenMiddleware],
  exports: [TokenMiddleware],
})
export class MiddlewareModule {}
