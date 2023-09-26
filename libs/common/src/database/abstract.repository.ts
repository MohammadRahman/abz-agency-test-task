import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly itemsRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const entity = await this.itemsRepository.findOne({ where, relations });

    if (!entity) {
      this.logger.warn('Document not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.itemsRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  // async find(where: FindOptionsWhere<T>) {
  //   return this.itemsRepository.findBy(where);
  // }
  async find(
    where: FindOptionsWhere<T>,
    limit: number,
    afterId?: number,
  ): Promise<{ data: T[]; hasNext: boolean }> {
    const query = this.itemsRepository
      .createQueryBuilder()
      .where(where)
      .orderBy('createdAt', 'DESC') // Assuming 'createdAt' is the creation date column
      .limit(limit + 1);

    if (afterId) {
      query.andWhere('id < :afterId', { afterId });
    }

    const results = await query.getMany();

    const hasNext = results.length > limit;

    if (hasNext) {
      results.pop(); // Remove the extra record used to determine if there's a next page
    }

    return { data: results, hasNext };
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.itemsRepository.delete(where);
  }
}
