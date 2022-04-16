import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export class Banner extends BaseEntity {
  @Column()
  image: string;

  @Column()
  title: string;

  @Column()
  description: string;
}
