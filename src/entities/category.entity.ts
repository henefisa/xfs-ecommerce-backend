import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class Category extends BaseEntity {
  @ManyToMany(() => Product, (product) => product.categories, { cascade: true })
  @JoinTable()
  products: Product[];

  @Column()
  name: string;
}
