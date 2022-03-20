import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// entities
import { User, UserAddress } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {}

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ username });
    if (user) {
      return false;
    }
    return true;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return false;
    }
    return true;
  }

  async updateUser(user: User) {
    return this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  async getUsers(limit: number, offset: number): Promise<[User[], number]> {
    return this.userRepository.findAndCount({ skip: offset, take: limit });
  }

  async getUserByUsername(username: string) {
    return this.userRepository.findOne({ username });
  }

  async setCurrentHashedRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    return this.userRepository.update(userId, { hashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.userRepository.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      return null;
    }

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      return null;
    }
    return user;
  }

  async removeHashedRefreshToken(user: User) {
    return this.userRepository.save(user);
  }

  async createUserAddress(userAddress: UserAddress) {
    return this.userAddressRepository.save(userAddress);
  }

  async updateUserAddress(userAddress: UserAddress) {
    return this.userAddressRepository.save(userAddress);
  }

  async deleteUserAddress(id: string) {
    return this.userAddressRepository.delete(id);
  }

  async getUserAddressById(id: string) {
    return this.userAddressRepository.findOne(id);
  }

  async updateRole(user: User) {
    return this.userRepository.save(user);
  }

  async updateStatus(user: User) {
    return this.userRepository.save(user);
  }
}
