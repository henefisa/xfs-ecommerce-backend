import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import AlreadyUsedException from './exception/already-used.exception';
import User from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
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

  async updateUser(id: string, data: UpdateUserDto): Promise<User | null> {
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

  async getUser(id: string): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async getUsers(limit: number, offset: number): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({ skip: offset, take: limit });
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
}
