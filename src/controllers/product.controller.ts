import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extname } from 'path';

// DTO
import { CreateProductDTO, UpdateProductDTO } from 'src/DTO/product';

// entities
import { CategoryService, ProductService } from 'src/services';

// pipes
import { ValidationPipe } from 'src/pipes';

// entities
import { Product, ProductImage } from 'src/entities';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @UseInterceptors(
    FilesInterceptor('images', undefined, {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);

          if (
            ext !== '.png' &&
            ext !== '.jpg' &&
            ext !== '.gif' &&
            ext !== '.jpeg'
          ) {
            return cb(new BadRequestException('Only images are allowed'), null);
          }

          cb(null, `${nanoid()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  async createProduct(
    @Body() body: CreateProductDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const product = new Product();
    Object.assign(product, body);
    product.price = +body.price;
    product.stock = +body.stock;

    const imagePromises = files.map((file) => {
      const image = new ProductImage();
      image.url = '/upload/' + file.filename;
      return this.productService.createProductImage(image);
    });

    const images = await Promise.all(imagePromises);
    product.images = images;

    const categories = await this.categoryService.getCategoriesByIds(
      body.categories,
    );

    product.categories = categories;

    return this.productService.createProduct(product);
  }

  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }

  @UseInterceptors(
    FilesInterceptor('images', undefined, {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);

          if (
            ext !== '.png' &&
            ext !== '.jpg' &&
            ext !== '.gif' &&
            ext !== '.jpeg'
          ) {
            return cb(new BadRequestException('Only images are allowed'), null);
          }

          cb(null, `${nanoid()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Patch('/:productId')
  @UsePipes(new ValidationPipe())
  @ApiConsumes('multipart/form-data')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() body: UpdateProductDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const product = await this.productService.getProductById(productId);

    if (!product) {
      return new NotFoundException('Product not found');
    }

    Object.assign(product, body);
    product.price = +body.price;
    product.stock = +body.stock;

    if (files.length) {
      const imagePromises = files.map((file) => {
        const image = new ProductImage();
        image.url = '/upload/' + file.filename;
        return this.productService.createProductImage(image);
      });

      const images = await Promise.all(imagePromises);
      product.images = images;
    }

    return this.productService.updateProduct(product);
  }

  @Delete('/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('productId') productId: string) {
    await this.productService.deleteProduct(productId);
    return;
  }

  @Get('/:productId')
  async getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }
}
