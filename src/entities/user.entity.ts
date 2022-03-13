import { BeforeInsert, Column, Entity } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { BaseEntity } from './base.entity';

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
}
