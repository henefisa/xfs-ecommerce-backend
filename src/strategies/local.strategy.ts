import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

// entities
import { User } from 'src/entities';

// services
import { AuthenticationService } from 'src/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(username, password);
  }
}
