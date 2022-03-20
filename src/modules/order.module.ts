import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers
import { OrderController } from 'src/controllers';

// entities
import { Order, OrderDetail } from 'src/entities';

// services
import { OrderService } from 'src/services';

// modules
import { ProductModule } from './product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail]), ProductModule],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
