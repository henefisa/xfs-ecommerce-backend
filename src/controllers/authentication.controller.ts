import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { compare } from 'bcrypt';
import { Request } from 'express';

// DTO
import { RegisterDTO, LoginDTO } from 'src/DTO/authentication';

// exceptions
import AlreadyUsedException from 'src/exceptions/already-used.exception';

// guards
import { JWTAuthenticationGuard, JWTRefreshTokenGuard } from 'src/guards';

// interfaces
import { RequestWithUser } from 'src/interfaces';

// pipes
import { ValidationPipe } from 'src/pipes';

// services
import { AuthenticationService, UsersService } from 'src/services';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: RegisterDTO })
  async register(@Body() body: RegisterDTO) {
    const isUsernameAvailable = await this.usersService.isUsernameAvailable(
      body.username,
    );
    if (!isUsernameAvailable) {
      throw new AlreadyUsedException('Username', body.username);
    }

    const isEmailAvailable = await this.usersService.isEmailAvailable(
      body.email,
    );
    if (!isEmailAvailable) {
      throw new AlreadyUsedException('Email', body.email);
    }

    const user = await this.authenticationService.register(body);

    delete user.password;

    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: LoginDTO })
  async login(@Body() body: LoginDTO, @Req() request: Request) {
    const user = await this.usersService.getUserByUsername(body.username);
    if (!user) {
      throw new NotFoundException(`${body.username} not found!`);
    }

    const isValidPassword = await compare(body.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(`Invalid password!`);
    }

    const accessToken = this.authenticationService.generateAccessToken(user);
    const refreshToken = this.authenticationService.generateRefreshToken(user);

    this.usersService.setCurrentHashedRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTRefreshTokenGuard)
  async refreshToken(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const accessToken = this.authenticationService.generateAccessToken(
      request.user,
    );
    const refreshToken = this.authenticationService.generateRefreshToken(
      request.user,
    );

    this.usersService.setCurrentHashedRefreshToken(
      refreshToken,
      request.user.id,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('log-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JWTAuthenticationGuard)
  async logout(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    await this.usersService.removeHashedRefreshToken(request.user.id);

    return {};
  }
}
