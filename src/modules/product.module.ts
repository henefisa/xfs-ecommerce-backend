import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// services
import { ProductService } from '../services/product.service';

// controllers
import { ProductController } from 'src/controllers/product.controller';

// entities
import { Product, ProductImage } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  providers: [ProductService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
