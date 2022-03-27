import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers
import { AuthenticationController } from 'src/controllers';

// entities
import { User } from 'src/entities';

// services
import { AuthenticationService } from 'src/services/authentication.service';

// strategies
import {
  LocalStrategy,
  JWTStrategy,
  JWTRefreshTokenStrategy,
} from 'src/strategies';

// modules
import { UsersModule } from '.';
import { StripeModule } from './stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    PassportModule,
    StripeModule,
  ],
  exports: [AuthenticationService],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JWTStrategy,
    JWTRefreshTokenStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
