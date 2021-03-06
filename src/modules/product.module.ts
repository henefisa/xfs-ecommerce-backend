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
  OrderDetail,
  Order,
} from '../entities';
import { CategoryService } from 'src/services';
import { CategoryModule } from './category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Category,
      ProductReview,
      ProductReviewImage,
      Order,
      OrderDetail,
    ]),
    CategoryModule,
  ],
  providers: [ProductService, CategoryService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
