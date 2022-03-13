import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class ProductImage extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.images, { cascade: true })
  @JoinColumn()
  product: Product;

  @Column()
  url: string;
}
