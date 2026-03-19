import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrasi user baru' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registrasi berhasil',
    schema: {
      example: {
        id: '0f7c31d9-4d29-4cf4-93e3-6c7e64a5f8f0',
        username: 'Lia',
        email: 'lia@wmail.com',
        token: 'jwt-token',
      },
    },
  })
  async register(@Body() body: RegisterDto) {
    const { username, email, password } = body;
    return this.authService.register(username, email, password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Login berhasil',
    schema: {
      example: {
        id: '0f7c31d9-4d29-4cf4-93e3-6c7e64a5f8f0',
        username: 'Lia',
        email: 'lia@wmail.com',
        token: 'jwt-token',
      },
    },
  })
  async login(@Body() body: LoginDto) {
    const { usernameOrEmail, password } = body;
    return this.authService.login(usernameOrEmail, password);
  }
}
