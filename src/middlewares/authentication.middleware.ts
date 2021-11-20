import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// services
import { UsersService } from 'src/services';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }

    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException();
        }
        throw new UnauthorizedException(error.message);
      }

      const user = this.userService.getUser(payload.id);

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      request.user = user;
      next();
    });
  }
}
