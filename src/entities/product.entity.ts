import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

// entities
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
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

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    eager: true,
  })
  images: ProductImage[];

  @ManyToMany(() => Category, (category) => category.products, {
    eager: true,
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => ProductReview, (productReview) => productReview.product)
  reviews: ProductReview[];
}
