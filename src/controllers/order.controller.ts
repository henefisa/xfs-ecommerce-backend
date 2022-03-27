import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDTO, UpdateOrderDTO } from 'src/DTO/order';

// entities
import { Order, OrderDetail } from 'src/entities';

// enums
import { EOrderPaymentType, EOrderStatus } from 'src/enums/order.enum';

// guards
import { JWTAuthenticationGuard } from 'src/guards';

// interfaces
import { RequestWithUser } from 'src/interfaces';

// pipes
import { ValidationPipe } from 'src/pipes';

// services
import { OrderService, ProductService } from 'src/services';

@Controller('order')
@UseGuards(new JWTAuthenticationGuard())
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async create(@Req() request: RequestWithUser, @Body() body: CreateOrderDTO) {
    const order = new Order();
    Object.assign(order, body);
    order.user = request.user;

    const transformed = body.products.reduce((acc, val) => {
      return (
        (acc[val.productId] = (acc[val.productId] || 0) + val.quantity), acc
      );
    }, {} as Record<string, number>);

    if (order.paymentType !== EOrderPaymentType.CASH) {
      order.status = EOrderStatus.WAIT_FOR_PAYMENT;
    }

    order.trackingNumber = this.orderService.generateTrackingNumber();

    const orderDetails = await Promise.all(
      Object.entries(transformed).map(async ([productId, quantity]) => {
        const product = await this.productService.getProductById(productId);
        if (quantity > product.stock) {
          throw new BadRequestException('Product out of stock');
        }

        const orderDetail = new OrderDetail();
        orderDetail.quantity = quantity;
        orderDetail.product = product;
        orderDetail.price = product.price * quantity;

        return orderDetail;
      }),
    );

    const createdOrder = await this.orderService.createOrder(
      order,
      orderDetails,
    );

    return createdOrder;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() body: UpdateOrderDTO) {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = body.status;

    return this.orderService.updateOrderStatus(order);
  }

  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
}
