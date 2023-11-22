import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Response,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  async login(@Body() body: LoginDto, @Response() res) {
    try {
      console.log(body.email, body.password);

      const { token, ...user } = await this.authService.auth(
        body.email,
        body.password,
      );

      return res.set('set-cookie', token).json(user).send();
    } catch (error) {
      console.log(error?.log || error.message);
      throw new HttpException(error.message, error.status || 400);
    }
  }

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() body: RegisterDto) {
    try {
      console.log(body.email, body.password);

      const registerResponse = await this.authService.register(body);

      return registerResponse;
    } catch (error) {
      console.log(error?.log || error.message);
      throw new HttpException(error.message, error.status || 400);
    }
  }
}
