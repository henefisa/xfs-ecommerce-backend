import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTO
import { UpdateUserDTO } from 'src/DTO/users';

// entities
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

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

  async getUser(id: string): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async getUsers(limit: number, offset: number): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({ skip: offset, take: limit });
  }
}
