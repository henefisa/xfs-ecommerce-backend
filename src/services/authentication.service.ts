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

// DTO
import { RegisterDTO } from 'src/DTO/authentication';

// interfaces
import { TokenPayload } from 'src/interfaces';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDTO) {
    const newUser = this.usersRepository.create(data);
    await this.usersRepository.save(newUser);
    return newUser;
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
      expiresIn: '300s',
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${300})}`;
    return {
      token,
      cookie,
    };
  }

  getCookieForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  generateRefreshToken(user: User) {
    const payload: TokenPayload = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1d',
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=1d}`;
    return {
      token,
      cookie,
    };
  }
}
