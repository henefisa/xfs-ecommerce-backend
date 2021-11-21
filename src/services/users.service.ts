import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// DTO
import { UpdateUserDTO } from 'src/DTO/users';

// entities
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

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

  async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }

    return this.usersRepository.save({
      ...user,
      ...data,
      updatedAt: new Date(),
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async getUsers(limit: number, offset: number): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({ skip: offset, take: limit });
  }

  async getUserByUsername(username: string) {
    return this.usersRepository.findOne({ username });
  }

  async setCurrentHashedRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    return this.usersRepository.update(userId, { hashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.usersRepository.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      return null;
    }

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      return null;
    }
    return user;
  }

  async removeHashedRefreshToken(userId: string) {
    return this.usersRepository.update(userId, { hashedRefreshToken: null });
  }
}
