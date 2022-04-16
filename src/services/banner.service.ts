import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Banner } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}

  async create(banner: Banner) {
    return this.bannerRepository.save(banner);
  }

  async update(banner: Banner) {
    return this.bannerRepository.save(banner);
  }

  async delete(id: string) {
    return this.bannerRepository.delete(id);
  }

  async getById(id: string) {
    return this.bannerRepository.findOne(id);
  }

  async getAll() {
    return this.bannerRepository.find();
  }
}
