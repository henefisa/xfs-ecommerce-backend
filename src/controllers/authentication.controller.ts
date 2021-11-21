import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
  @UsePipes(new ValidationPipe())
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

    return this.authenticationService.register(body);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
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

    this.usersService.setCurrentHashedRefreshToken(refreshToken.token, user.id);

    request.res.setHeader('Set-Cookie', [
      accessToken.cookie,
      refreshToken.cookie,
    ]);

    delete user.password;

    return {
      statusCode: HttpStatus.ACCEPTED,
      user,
    };
  }

  @Get('refresh-token')
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
      refreshToken.token,
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', [
      accessToken.token,
      refreshToken.token,
    ]);

    delete request.user.password;
    return {
      statusCode: HttpStatus.ACCEPTED,
      user: request.user,
    };
  }

  @Post('log-out')
  @UseGuards(JWTAuthenticationGuard)
  async logout(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    await this.usersService.removeHashedRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogout(),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Logout',
    };
  }
}
