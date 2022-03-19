import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

// DTO
import { UpdateUserDTO } from 'src/DTO/user';

// guards
import { JWTAuthenticationGuard } from 'src/guards';

// interfaces
import { RequestWithUser } from 'src/interfaces';

// services
import { UserService } from '../services/user.service';

@Controller('users')
@UseGuards(new JWTAuthenticationGuard())
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(id, body);
  }

  @UseGuards(JWTAuthenticationGuard)
  @Get('me')
  async getMe(@Req() request: RequestWithUser) {
    delete request.user.password;

    return request.user;
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get()
  async getUsers(@Query('limit') limit = 5, @Query('offset') offset = 0) {
    const [users, count] = await this.userService.getUsers(limit, offset);
    return {
      count,
      users,
    };
  }
}
