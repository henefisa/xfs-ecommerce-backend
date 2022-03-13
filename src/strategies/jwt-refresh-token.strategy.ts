import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// services
import { UserService } from 'src/services';

// interfaces
import { TokenPayload } from 'src/interfaces';

@Injectable()
export class JWTRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      return null;
    }

    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
