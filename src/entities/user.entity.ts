import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { BaseEntity } from './base.entity';
import { EUserRole, EUserStatus } from 'src/enums';
import { ProductReview } from './product-review.entity';
import { UserAddress } from './user-address.entity';

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
}
