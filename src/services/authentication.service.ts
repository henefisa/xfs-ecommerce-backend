import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

// entities
import { User } from 'src/entities';

// interfaces
import { TokenPayload } from 'src/interfaces';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(user: User) {
    return this.usersRepository.save(user);
  }

  async getAuthenticatedUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({
      username: username,
    });
    if (!user) {
      throw new NotFoundException(`${username} not found!`);
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(`Invalid password!`);
    }
    return user;
  }

  generateAccessToken(user: User) {
    const payload: TokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1d',
    });

    return token;
  }

  generateRefreshToken(user: User) {
    const payload: TokenPayload = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1d',
    });

    return token;
  }
}
