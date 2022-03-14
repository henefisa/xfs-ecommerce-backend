import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entities
import { Product, ProductCategory, ProductImage } from 'src/entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
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

  async updateProduct(productId: string, product: Product) {
    return this.productRepository.update(productId, product);
  }

  async deleteProduct(productId: string) {
    return this.productRepository.delete(productId);
  }

  async createProductCategory(productCategory: ProductCategory) {
    return this.productCategoryRepository.save(productCategory);
  }

  async updateProductCategory(id: string, productCategory: ProductCategory) {
    return this.productCategoryRepository.update(id, productCategory);
  }

  async deleteProductCategory(id: string) {
    return this.productCategoryRepository.delete(id);
  }
}
