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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

// DTO
import { CreateProductDTO, UpdateProductDTO } from 'src/DTO/product';

// entities
import { CategoryService, ProductService } from 'src/services';

// pipes
import { ValidationPipe } from 'src/pipes';

// entities
import {
  Product,
  ProductImage,
  ProductReview,
  ProductReviewImage,
} from 'src/entities';
import { ReviewProductDTO } from 'src/DTO/product/review-product.dto';
import { RequestWithUser } from 'src/interfaces';
import { JWTAuthenticationGuard } from 'src/guards';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  async findProduct(id: string) {
    const product = await this.productService.getProductById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findReview(id: string) {
    const review = await this.productService.getProductReviewById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
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

          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/create')
  @UseGuards(JWTAuthenticationGuard)
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
    product.categories = null;

    if (body.categories.length) {
      const categories = await this.categoryService.getCategoriesByIds(
        body.categories,
      );
      product.categories = categories;
    }

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

          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Patch('/:productId')
  @UsePipes(new ValidationPipe())
  @UseGuards(JWTAuthenticationGuard)
  @ApiConsumes('multipart/form-data')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() body: UpdateProductDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const product = await this.findProduct(productId);

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
  @UseGuards(JWTAuthenticationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @Get('/:productId')
  async getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
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

          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/:productId/review/create')
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  @UseGuards(JWTAuthenticationGuard)
  async createReview(
    @Req() request: RequestWithUser,
    @Body() body: ReviewProductDTO,
    @Param('productId') productId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const product = await this.findProduct(productId);

    const review = new ProductReview();
    review.content = body.content;
    review.rating = body.rating;

    if (files.length) {
      const imagePromises = files.map((file) => {
        const image = new ProductReviewImage();
        image.url = '/upload/' + file.filename;
        return this.productService.createProductReviewImage(image);
      });

      const images = await Promise.all(imagePromises);
      review.images = images;
    }

    review.product = product;
    review.user = request.user;

    return this.productService.createProductReview(review);
  }

  @Post('/:productId/review/:id/like')
  async likeReview(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    await this.findProduct(productId);
    await this.findReview(id);

    return this.productService.updateReviewLike(id);
  }
}
