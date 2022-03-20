import { AfterInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

// entities
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderDetail extends BaseEntity {
  @AfterInsert()
  async decreaseStock(data) {
    console.log(data);
  }

  @ManyToOne(() => Order, (order) => order.details, { cascade: true })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails, {
    cascade: true,
  })
  @JoinColumn()
  product: Product;

  @Column()
  price: number;

  @Column()
  quantity: number;
}
