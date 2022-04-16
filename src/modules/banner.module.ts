import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controller
import { BannerController } from 'src/controllers';

// banner
import { Banner } from 'src/entities';

// service
import { BannerService } from 'src/services';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  exports: [BannerService],
  providers: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}
