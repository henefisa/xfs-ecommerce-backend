import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entities
import {
  Product,
  ProductImage,
  ProductReview,
  ProductReviewImage,
} from 'src/entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductReview)
    private productReview: Repository<ProductReview>,
    @InjectRepository(ProductReviewImage)
    private productReviewImage: Repository<ProductReviewImage>,
  ) {}

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findOne(id, { relations: ['reviews'] });
  }

  async createProductImage(image: ProductImage) {
    return this.productImageRepository.save(image);
  }

  async createProduct(product: Product) {
    return this.productRepository.save(product);
  }

  async getProducts() {
    return this.productRepository.find();
  }

  async updateProduct(product: Product) {
    return this.productRepository.save(product);
  }

  async deleteProduct(productId: string) {
    return this.productRepository.softDelete(productId);
  }

  async createProductReview(review: ProductReview) {
    return this.productReview.save(review);
  }

  async deleteProductReview(id: string) {
    return this.productReview.delete(id);
  }

  async createProductReviewImage(image: ProductReviewImage) {
    return this.productReviewImage.save(image);
  }

  async getProductReviewById(id: string) {
    return this.productReview.findOne(id);
  }

  async updateReviewLike(id: string) {
    return this.productReview.update(id, { like: () => 'like + 1' });
  }
}
