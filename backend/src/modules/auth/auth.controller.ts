import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from 'src/common/api.response';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.login(loginUserDto);
      return ApiResponse.success(user, 'Login successful');
    } catch (error) {
      return ApiResponse.error('UNAUTHORIZED', (error as Error).message);
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.register(createUserDto);
      return ApiResponse.success(result, 'User registered successfully');
    } catch (error) {
      return ApiResponse.error('REGISTRATION_ERROR', (error as Error).message);
    }
  }
}
