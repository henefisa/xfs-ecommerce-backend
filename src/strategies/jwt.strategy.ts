import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// interfaces
import { TokenPayload } from 'src/interfaces';

// services
import { UserService } from 'src/services';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userServices: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    } as StrategyOptions);
  }

  async validate(payload: TokenPayload) {
    return this.userServices.getUserById(payload.userId);
  }
}
