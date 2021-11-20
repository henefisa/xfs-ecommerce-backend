import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers
import { AuthenticationController } from 'src/controllers';

// entities
import { User } from 'src/entities';

// middlewares
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';

// services
import { AuthenticationService } from 'src/services/authentication.service';

// modules
import { UsersModule } from '.';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  exports: [AuthenticationService],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({
      path: 'users',
      method: RequestMethod.ALL,
    });
  }
}
