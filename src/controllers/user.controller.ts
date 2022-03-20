import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators';

// DTO
import {
  CreateUserAddressDTO,
  UpdateUserAddressDTO,
  UpdateUserDTO,
  UpdateUserRoleDTO,
} from 'src/DTO/user';
import { UpdateUserStatusDTO } from 'src/DTO/user/update-user-status.dto';

// entities
import { UserAddress } from 'src/entities';

// enums
import { EUserRole } from 'src/enums';

// guards
import { JWTAuthenticationGuard } from 'src/guards';

// interfaces
import { RequestWithUser } from 'src/interfaces';

// pipes
import { ValidationPipe } from 'src/pipes';

// services
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(new JWTAuthenticationGuard())
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('/address')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async createUserAddress(@Body() body: CreateUserAddressDTO) {
    const userAddress = new UserAddress();
    Object.assign(userAddress, body);

    return this.userService.createUserAddress(userAddress);
  }

  @Patch('/address/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async updateUserAddress(
    @Param('id') id: string,
    @Body() body: UpdateUserAddressDTO,
  ) {
    const userAddress = await this.userService.getUserAddressById(id);

    if (!userAddress) {
      throw new NotFoundException('User address not found');
    }

    Object.assign(userAddress, body);

    return this.userService.updateUserAddress(userAddress);
  }

  @Delete('/address/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserAddress(@Param('id') id: string) {
    return this.userService.deleteUserAddress(id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, body);

    return this.userService.updateUser(user);
  }

  @Get('profile')
  @ApiBearerAuth()
  async getMe(@Req() request: RequestWithUser) {
    delete request.user.password;
    delete request.user.hashedRefreshToken;

    return request.user;
  }

  @Get('/:id')
  @ApiBearerAuth()
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get()
  @ApiBearerAuth()
  async getUsers(@Query('limit') limit = 5, @Query('offset') offset = 0) {
    const [users, count] = await this.userService.getUsers(limit, offset);
    return {
      count,
      users,
    };
  }

  @Patch('/role/:id')
  @ApiBearerAuth()
  @Roles(EUserRole.SUPER_ADMIN, EUserRole.ADMIN)
  async updateRole(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
    @Body() body: UpdateUserRoleDTO,
  ) {
    if (request.user.roles.includes(EUserRole.SUPER_ADMIN)) {
      request.user.roles = body.roles;
      return this.userService.updateRole(request.user);
    }

    if (body.roles.includes(EUserRole.SUPER_ADMIN)) {
      return new ForbiddenException();
    }

    request.user.roles = body.roles;

    return this.userService.updateRole(request.user);
  }

  @Patch('/status/:id')
  @Roles(EUserRole.SUPER_ADMIN, EUserRole.ADMIN)
  async updateStatus(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
    @Body() body: UpdateUserStatusDTO,
  ) {
    request.user.status = body.status;

    return this.userService.updateStatus(request.user);
  }
}
