import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// services
import { ProductService } from '../services/product.service';

// controllers
import { ProductController } from 'src/controllers/product.controller';

// entities
import {
  Product,
  ProductCategory,
  ProductImage,
  ProductReview,
  ProductReviewImage,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProductCategory,
      ProductReview,
      ProductReviewImage,
    ]),
  ],
  providers: [ProductService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
