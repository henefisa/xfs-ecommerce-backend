import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// services
import { ProductService } from '../services/product.service';

// controllers
import { ProductController } from 'src/controllers/product.controller';

// entities
import {
  Product,
  Category,
  ProductImage,
  ProductReview,
  ProductReviewImage,
} from '../entities';
import { CategoryService } from 'src/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Category,
      ProductReview,
      ProductReviewImage,
    ]),
  ],
  providers: [ProductService, CategoryService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
