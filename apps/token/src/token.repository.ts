import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AccessToken } from './entity/token.entity';

@Injectable()
export class TokenRepository extends AbstractRepository<AccessToken> {
  protected readonly logger = new Logger(AccessToken.name);

  constructor(
    @InjectRepository(AccessToken)
    tokenRepository: Repository<AccessToken>,
    entityManager: EntityManager,
  ) {
    super(tokenRepository, entityManager);
  }
}
