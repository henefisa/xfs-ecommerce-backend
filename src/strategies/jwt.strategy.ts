import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

// interfaces
import { TokenPayload } from 'src/interfaces';

// services
import { UsersService } from 'src/services';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersServices: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    } as StrategyOptions);
  }

  async validate(payload: TokenPayload) {
    return this.usersServices.getUserById(payload.userId);
  }
}
