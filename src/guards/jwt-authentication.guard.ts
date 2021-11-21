import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

@Injectable()
export class JWTAuthenticationGuard extends AuthGuard('jwt') {
  handleRequest(error, user, info) {
    if (
      [TokenExpiredError, JsonWebTokenError, NotBeforeError].some(
        (c) => info instanceof c,
      )
    ) {
      throw new UnauthorizedException(info.message);
    }

    if (error || !user) {
      throw error || new UnauthorizedException();
    }

    return user;
  }
}
