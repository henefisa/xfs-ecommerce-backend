import { Column, Entity, ManyToOne } from 'typeorm';

// entities
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class UserAddress extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
