import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import CreateUserDto from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body);
    return {
      statusCode: HttpStatus.CREATED,
      user,
    };
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
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
