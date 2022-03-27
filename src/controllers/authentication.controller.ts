import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { compare } from 'bcrypt';

// DTO
import { RegisterDTO, LoginDTO } from 'src/DTO/authentication';

// entities
import { User } from 'src/entities';

// exceptions
import AlreadyUsedException from 'src/exceptions/already-used.exception';

// guards
import { JWTAuthenticationGuard, JWTRefreshTokenGuard } from 'src/guards';

// interfaces
import { RequestWithUser } from 'src/interfaces';

// pipes
import { ValidationPipe } from 'src/pipes';

// services
import {
  AuthenticationService,
  StripeService,
  UserService,
} from 'src/services';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: RegisterDTO })
  async register(@Body() body: RegisterDTO) {
    const isUsernameAvailable = await this.userService.isUsernameAvailable(
      body.username,
    );
    if (!isUsernameAvailable) {
      throw new AlreadyUsedException('Username', body.username);
    }

    const isEmailAvailable = await this.userService.isEmailAvailable(
      body.email,
    );
    if (!isEmailAvailable) {
      throw new AlreadyUsedException('Email', body.email);
    }

    const stripeCustomer = await this.stripeService.createCustomer(
      `${body.firstName + body.lastName}`,
      body.email,
    );

    const newUser = new User();
    Object.assign(newUser, body);
    newUser.stripeCustomerId = stripeCustomer.id;

    const user = await this.authenticationService.register(newUser);

    delete user.password;
    delete user.hashedRefreshToken;

    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: LoginDTO })
  async login(@Body() body: LoginDTO) {
    const user = await this.userService.getUserByUsername(body.username);
    if (!user) {
      throw new NotFoundException(`Invalid username or password`);
    }

    const isValidPassword = await compare(body.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(`Invalid username or password`);
    }

    const accessToken = this.authenticationService.generateAccessToken(user);
    const refreshToken = this.authenticationService.generateRefreshToken(user);

    this.userService.setCurrentHashedRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh-token')
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

    this.userService.setCurrentHashedRefreshToken(
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
  @ApiBearerAuth()
  async logout(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    request.user.hashedRefreshToken = null;

    await this.userService.removeHashedRefreshToken(request.user);

    return {};
  }
}
