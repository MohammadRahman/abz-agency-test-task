import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { CreateTokeDto } from '../dto/create-token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}
  async storeToken(token: any) {
    const tokenStored = await this.tokenRepository.create(token);
    return tokenStored;
  }
  async findToken(tokenDto: CreateTokeDto['token']) {
    return await this.tokenRepository.findOne({ token: tokenDto });
  }
  async findOneAndUpdate(token: string) {
    return this.tokenRepository.findOneAndUpdate({ token }, { count: 1 });
  }
}
