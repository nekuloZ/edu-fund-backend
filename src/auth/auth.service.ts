import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * 验证用户登录信息
   * 比较传入的密码与数据库中加密后的密码
   */
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('用户名或密码错误');
  }

  /**
   * 登录方法：验证用户后生成 JWT Token
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    // payload 包含用户ID、用户名以及角色信息，后续可用于权限校验
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles?.map((role) => role.role_name) || [],
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
