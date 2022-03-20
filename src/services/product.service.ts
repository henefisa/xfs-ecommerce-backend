import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entities
import { Product, ProductImage } from 'src/entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
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
    return this.productRepository.delete(productId);
  }
}
