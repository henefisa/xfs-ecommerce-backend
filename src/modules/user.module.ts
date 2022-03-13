import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// services
import { UserService } from '../services/user.service';

// controllers
import { UsersController } from '../controllers/user.controller';

// entities
import { User } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
