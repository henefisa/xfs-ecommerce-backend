import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { nanoid } from 'nanoid';

// entities
import { Order, OrderDetail } from 'src/entities';

@Injectable()
export class OrderService {
  constructor(
    private connection: Connection,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    private configService: ConfigService,
  ) {}

  async createOrder(order: Order, orderDetails: OrderDetail[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const orderDetailsResponse = await queryRunner.manager.save(orderDetails);

      order.details = orderDetailsResponse;
      const orderResponse = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return orderResponse;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderStatus(order: Order) {
    return this.orderRepository.save(order);
  }

  async getOrderById(id: string) {
    return this.orderRepository.findOne(id);
  }

  generateTrackingNumber() {
    return `ORD${moment().format('YYMMDD') + nanoid(8)}`;
  }

  async getAllOrders() {
    return this.orderRepository.find();
  }
}
