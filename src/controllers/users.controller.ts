import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

// DTO
import { UpdateUserDTO } from 'src/DTO/users';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const user = await this.usersService.updateUser(id, body);
    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUser(id);
    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }

  @Get()
  async getUsers(@Query('limit') limit = 5, @Query('offset') offset = 0) {
    const [users, count] = await this.usersService.getUsers(limit, offset);
    return {
      statusCode: HttpStatus.OK,
      count,
      users,
    };
  }
}
