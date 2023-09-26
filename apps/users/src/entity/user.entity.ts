import { AbstractEntity } from '@app/common';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  name: string;
  @Column()
  email: string;

  @Column()
  phone: string;
  @Column()
  position_id: number;
  @Column({ nullable: true })
  file: string;

  @CreateDateColumn()
  createdAt: Date;
}
