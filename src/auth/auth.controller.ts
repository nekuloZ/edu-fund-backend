import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 用户登录接口，验证用户名和密码后返回 JWT Token
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * 用户注销接口
   * （此处仅返回注销成功提示，实际中可通过Token黑名单等方式处理）
   */
  @Post('logout')
  async logout() {
    return { message: '注销成功' };
  }
}
