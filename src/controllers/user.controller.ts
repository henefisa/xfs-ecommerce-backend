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
    const user = await this.userService.updateUser(id, body);
    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }

  @UseGuards(JWTAuthenticationGuard)
  @Get('me')
  async getMe(@Req() request: RequestWithUser) {
    delete request.user.password;

    return request.user;
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }

  @Get()
  async getUsers(@Query('limit') limit = 5, @Query('offset') offset = 0) {
    const [users, count] = await this.userService.getUsers(limit, offset);
    return {
      statusCode: HttpStatus.OK,
      count,
      users,
    };
  }
}
