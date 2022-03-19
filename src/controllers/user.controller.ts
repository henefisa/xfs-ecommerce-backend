import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

// DTO
import {
  CreateUserAddressDTO,
  UpdateUserAddressDTO,
  UpdateUserDTO,
} from 'src/DTO/user';

// entities
import { UserAddress } from 'src/entities';

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

  @Post('/address')
  @HttpCode(HttpStatus.CREATED)
  async createUserAddress(@Body() body: CreateUserAddressDTO) {
    const userAddress = new UserAddress();
    Object.assign(userAddress, body);

    return this.userService.createUserAddress(userAddress);
  }

  @Patch('/address/:id')
  @HttpCode(HttpStatus.CREATED)
  async updateUserAddress(
    @Param('id') id: string,
    @Body() body: UpdateUserAddressDTO,
  ) {
    const userAddress = new UserAddress();
    Object.assign(userAddress, body);

    return this.userService.updateUserAddress(id, userAddress);
  }

  @Delete('/address/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserAddress(@Param('id') id: string) {
    return this.userService.deleteUserAddress(id);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(id, body);
  }

  @UseGuards(JWTAuthenticationGuard)
  @Get('profile')
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
