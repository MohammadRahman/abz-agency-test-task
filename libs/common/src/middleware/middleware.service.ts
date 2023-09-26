import { Injectable, NestMiddleware } from '@nestjs/common';
import { TokenService } from 'apps/token/src/token.service';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('Get a token to create a user');
    }
    const newToken = token.split(' ')[1];

    try {
      const decodedToken = jwt.verify(newToken, 'secret');
      // req.token = decodedToken;
      next();
    } catch (error) {
      throw new Error('Token expired');
    }
  }
}
