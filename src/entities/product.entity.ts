import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column()
  description: string;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];
}
