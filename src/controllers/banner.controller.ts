import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiConsumes } from '@nestjs/swagger';

// services
import { BannerService } from 'src/services';

// DTOs
import { CreateBannerDTO, UpdateBannerDTO } from 'src/DTO/banner';

// entities
import { Banner } from 'src/entities';

// guards
import { JWTAuthenticationGuard } from 'src/guards';

// pipes
import { ValidationPipe } from 'src/pipes';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

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
  async create(
    @Body() body: CreateBannerDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const banner = new Banner();
    Object.assign(banner, body);
    banner.image = '/upload/' + file.filename;

    return this.bannerService.create(banner);
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
  @Patch('/:id')
  @UseGuards(JWTAuthenticationGuard)
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBannerDTO,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const banner = await this.bannerService.getById(id);

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    Object.assign(banner, body);

    if (file) {
      banner.image = '/upload/' + file.filename;
    }

    return this.bannerService.update(banner);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.bannerService.delete(id);
  }

  @Get('/')
  async getAll() {
    return this.bannerService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.bannerService.getById(id);
  }
}
