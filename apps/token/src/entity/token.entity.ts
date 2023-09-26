import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class AccessToken extends AbstractEntity<AccessToken> {
  @Column({ type: 'varchar' })
  token: string;
  @Column({ default: 0 })
  count: number;
}
