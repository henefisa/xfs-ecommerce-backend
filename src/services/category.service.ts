import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entities
import { Category } from 'src/entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(category: Category) {
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: string, category: Category) {
    return this.categoryRepository.update(id, category);
  }

  async deleteCategory(id: string) {
    return this.categoryRepository.delete(id);
  }

  async getCategoryById(id: string) {
    return this.categoryRepository.findOne(id);
  }

  async getCategoriesByIds(ids: string[]) {
    return this.categoryRepository.findByIds(ids);
  }
}
