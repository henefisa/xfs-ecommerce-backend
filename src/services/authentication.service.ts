import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

// entities
import { User } from 'src/entities';

// exceptions
import AlreadyUsedException from 'src/exceptions/already-used.exception';

// DTO
import { LoginDTO, RefreshTokenDTO, RegisterDTO } from 'src/DTO/authentication';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async register(data: RegisterDTO) {
    const canUseUsername = await this.isUsernameAvailable(data.username);
    if (!canUseUsername) {
      throw new AlreadyUsedException('Username', data.username);
    }

    const canUseEmail = await this.isEmailAvailable(data.email);
    if (!canUseEmail) {
      throw new AlreadyUsedException('Email', data.email);
    }

    const newUser = this.usersRepository.create(data);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async login(data: LoginDTO) {
    const user = await this.usersRepository.findOne({
      username: data.username,
    });
    if (!user) {
      throw new NotFoundException(`${data.username} not found!`);
    }

    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(`Invalid password!`);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user.id),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(data: RefreshTokenDTO) {
    const id = await this.verifyRefreshToken(data.refreshToken);
    if (!id) {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(id),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ username });
    if (user) {
      return false;
    }
    return true;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return false;
    }
    return true;
  }

  generateAccessToken(user: User): Promise<string> {
    return new Promise((resolve) => {
      const options = {
        expiresIn: '1h',
      };

      jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        options,
        (error, token) => {
          if (error) {
            throw new UnauthorizedException(error.message);
          }
          resolve(token);
        },
      );
    });
  }

  generateRefreshToken(id: string): Promise<string> {
    return new Promise((resolve) => {
      const payload = {
        id,
      };

      const options = {
        expiresIn: '10d',
      };

      jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        options,
        (error, token) => {
          if (error) {
            throw new UnauthorizedException(error.message);
          }
          resolve(token);
        },
      );
    });
  }

  verifyRefreshToken(refreshToken: string): Promise<string> {
    return new Promise((resolve) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, payload) => {
          if (error) {
            throw new UnauthorizedException(error.message);
          }
          resolve(payload.id);
        },
      );
    });
  }
}
