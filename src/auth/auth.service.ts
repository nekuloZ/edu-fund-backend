import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  // 存储刷新令牌的映射表（实际应用中应该使用Redis等存储）
  private refreshTokens: Map<
    string,
    { userId: number; email: string; roles: string[] }
  > = new Map();

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * 验证用户登录信息
   * 比较传入的密码与数据库中加密后的密码
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('邮箱或密码错误');
  }

  /**
   * 登录方法：验证用户后生成 JWT Token 和刷新令牌
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // payload 包含用户ID、邮箱以及角色信息，后续可用于权限校验
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles?.map((role) => role.name) || ['user'],
    };

    // 生成刷新令牌
    const refreshToken = this.generateRefreshToken(
      payload.sub,
      payload.email,
      payload.roles,
    );

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: payload.roles,
      },
    };
  }

  /**
   * 注册新用户
   */
  async register(registerDto: RegisterDto): Promise<any> {
    // 检查邮箱是否已存在
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('该邮箱已被注册');
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      username: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    // 移除密码后返回
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 生成刷新令牌
   */
  private generateRefreshToken(
    userId: number,
    email: string,
    roles: string[],
  ): string {
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' }, // 刷新令牌有效期更长
    );

    // 存储刷新令牌与用户的关联
    this.refreshTokens.set(refreshToken, { userId, email, roles });

    return refreshToken;
  }

  /**
   * 使用刷新令牌获取新的访问令牌
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      // 验证刷新令牌是否有效
      const _decoded = this.jwtService.verify(refreshToken);
      const userData = this.refreshTokens.get(refreshToken);

      if (!userData) {
        throw new UnauthorizedException('刷新令牌无效');
      }

      const payload = {
        email: userData.email,
        sub: userData.userId,
        roles: userData.roles,
      };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch {
      throw new UnauthorizedException('刷新令牌已过期或无效');
    }
  }

  /**
   * 注销登录
   */
  async logout(
    refreshToken: string,
  ): Promise<{ success: boolean; message: string }> {
    // 如果存在该刷新令牌，则从映射表中移除
    const success = this.refreshTokens.delete(refreshToken);
    return {
      success,
      message: success ? '退出登录成功' : '令牌不存在或已失效',
    };
  }
}
