import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

@Entity()
export class User {
  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt(10);
    const _pw = await hash(this.password, salt);
    this.password = _pw;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  phoneNumber: string;

  @Column()
  birthday: Date;

  @Column({ nullable: true, default: null })
  hashedRefreshToken: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: null, nullable: true })
  updatedAt: Date;
}
