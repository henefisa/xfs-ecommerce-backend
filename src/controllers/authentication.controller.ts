import { Body, Controller, Post, UsePipes } from '@nestjs/common';

// DTO
import { RegisterDTO, LoginDTO, RefreshTokenDTO } from 'src/DTO/authentication';

// pipes
import { ValidationPipe } from 'src/pipes';

// services
import { AuthenticationService } from 'src/services';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async register(@Body() body: RegisterDTO) {
    return this.authenticationService.register(body);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginDTO) {
    return this.authenticationService.login(body);
  }

  @Post('/refresh-token')
  @UsePipes(new ValidationPipe())
  async refreshToken(@Body() body: RefreshTokenDTO) {
    return this.authenticationService.refreshToken(body);
  }
}
