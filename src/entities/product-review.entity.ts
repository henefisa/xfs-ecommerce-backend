import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductReviewImage } from './product-review-image.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class ProductReview extends BaseEntity {
  @Column()
  rating: number;

  @Column()
  content: string;

  @Column()
  like: number;

  @OneToMany(
    () => ProductReviewImage,
    (productReviewImage) => productReviewImage.productReview,
  )
  images: ProductReviewImage[];

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
