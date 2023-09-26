import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Post('')
  async createToken(@Body() token: any) {
    return await this.tokenService.storeToken(token);
  }
  @Get(':token')
  async getToken(@Param('token') token: string) {
    return await this.tokenService.findToken(token);
  }
}
