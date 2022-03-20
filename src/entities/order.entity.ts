import { EOrderPaymentType, EOrderStatus } from 'src/enums/order.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

// entities
import { BaseEntity } from './base.entity';
import { OrderDetail } from './order-detail.entity';
import { User } from './user.entity';

@Entity()
export class Order extends BaseEntity {
  @Column()
  address: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  village: string;

  @Column()
  phoneNumber: string;

  @Column()
  trackingNumber: string;

  @Column({ type: 'enum', enum: EOrderStatus, default: EOrderStatus.RECEIVED })
  status: EOrderStatus;

  @Column({
    type: 'enum',
    enum: EOrderPaymentType,
    default: EOrderPaymentType.CASH,
  })
  paymentType: EOrderPaymentType;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    eager: true,
  })
  details: OrderDetail[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;
}
