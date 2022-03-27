import { Module } from '@nestjs/common';

// controllers
import { UploadController } from 'src/controllers';

@Module({
  controllers: [UploadController],
})
export class UploadModule {}
