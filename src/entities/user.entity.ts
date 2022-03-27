import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

// enums
import { EUserRole, EUserStatus } from 'src/enums';

// entities
import { BaseEntity } from './base.entity';
import { ProductReview } from './product-review.entity';
import { UserAddress } from './user-address.entity';
import { Order } from './order.entity';

@Entity()
export class User extends BaseEntity {
  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt(10);
    const _pw = await hash(this.password, salt);
    this.password = _pw;
  }

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  birthday: Date;

  @Column({ nullable: true, default: null })
  hashedRefreshToken: string;

  @Column()
  stripeCustomerId: string;

  @Column({
    type: 'enum',
    enum: EUserRole,
    array: true,
    default: [EUserRole.USER],
  })
  roles: EUserRole[];

  @Column({ type: 'enum', enum: EUserStatus, default: EUserStatus.ACTIVE })
  status: EUserStatus;

  @OneToMany(() => ProductReview, (productReview) => productReview.user)
  reviews: ProductReview[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  addresses: UserAddress[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
