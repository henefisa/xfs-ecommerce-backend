import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CreateProductDTO } from 'src/DTO/product';
import { ProductService } from 'src/services';
import { nanoid } from 'nanoid';
import { extname } from 'path';
import { ValidationPipe } from 'src/pipes';
import { Product, ProductImage } from 'src/entities';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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

    const imagePromises = files.map((file) => {
      const image = new ProductImage();
      image.url = '/' + file.filename;
      return this.productService.createProductImage(image);
    });

    const images = await Promise.all(imagePromises);
    product.images = images;

    return this.productService.createProduct(product);
  }

  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }
}