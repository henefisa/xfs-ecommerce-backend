import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  AuthenticationModule,
  DatabaseModule,
  ProductModule,
  UsersModule,
  CategoryModule,
  OrderModule,
  UploadModule,
  BannerModule,
} from './modules';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UsersModule,
    AuthenticationModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    BannerModule,
    UploadModule,
    DatabaseModule,
    MulterModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
