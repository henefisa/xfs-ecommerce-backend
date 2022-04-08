import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductReview } from './product-review.entity';

@Entity()
export class ProductReviewImage extends BaseEntity {
  @ManyToOne(() => ProductReview, (productReview) => productReview.images)
  @JoinColumn()
  productReview: ProductReview;

  @Column()
  url: string;
}
