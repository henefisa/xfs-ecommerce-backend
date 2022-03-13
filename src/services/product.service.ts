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
    return this.productRepository.findOne(id);
  }

  async getProductImageById(id: string): Promise<ProductImage | null> {
    return this.productImageRepository.findOne(id);
  }

  async getProductImagesByProductId(
    id: string,
  ): Promise<ProductImage[] | null> {
    return this.productImageRepository.find({
      where: {
        productId: id,
      },
    });
  }

  async createProductImage(image: ProductImage) {
    return this.productImageRepository.save(image);
  }

  async createProduct(product: Product) {
    return this.productRepository.save(product);
  }

  async getProducts() {
    return this.productRepository.find({ relations: ['images'] });
  }
}
