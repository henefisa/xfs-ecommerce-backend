import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// services
import { BannerService } from 'src/services';

// DTOs
import { CreateBannerDTO } from 'src/DTO/banner';

// entities
import { Banner } from 'src/entities';

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
  async create(
    @Body() body: CreateBannerDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const banner = new Banner();
    Object.assign(banner, body);
    banner.image = '/upload/' + file.filename;

    return this.bannerService.create(banner);
  }
}
