import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductCategory } from './product-category.entity';
import { ProductImage } from './product-image.entity';
import { ProductReview } from './product-review.entity';

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

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
  )
  categories: ProductCategory[];

  @OneToMany(() => ProductReview, (productReview) => productReview.product)
  reviews: ProductReview[];
}
