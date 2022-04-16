import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

// DTO
import { CreateCategoryDTO, UpdateCategoryDTO } from 'src/DTO/category';

// entities
import { Category } from 'src/entities';

// guards
import { JWTAuthenticationGuard } from 'src/guards';

// pipes
import { ValidationPipe } from 'src/pipes';

// services
import { CategoryService } from 'src/services';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(JWTAuthenticationGuard)
  async createCategory(@Body() body: CreateCategoryDTO) {
    const category = new Category();
    category.name = body.name;

    return this.categoryService.createCategory(category);
  }

  @Patch('/:id')
  @UseGuards(JWTAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDTO,
  ) {
    const category = new Category();
    category.name = body.name;

    return this.categoryService.updateCategory(id, category);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JWTAuthenticationGuard)
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Get('/')
  async getCategories() {
    return this.categoryService.getCategories();
  }
}
