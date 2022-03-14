import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class ProductCategory extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.categories)
  @JoinColumn()
  product: Product;

  @Column()
  name: string;
}
