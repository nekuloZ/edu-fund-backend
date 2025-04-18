import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  // 存储刷新令牌的映射表（实际应用中应该使用Redis等存储）
  private refreshTokens: Map<
    string,
    { userId: number; username: string; roles: string[] }
  > = new Map();

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 验证用户登录信息
   * 比较传入的密码与数据库中加密后的密码
   */
  async validateUser(username: string, password: string): Promise<any> {
    console.log(`尝试验证用户: ${username}`);

    const user = await this.userService.findByUsername(username);
    if (!user) {
      console.log(`用户 ${username} 不存在`);
      throw new UnauthorizedException('用户名或密码错误');
    }

    console.log(`找到用户: ${username}, ID: ${user.id}`);
    console.log(`用户角色数据:`, user.roles);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`密码验证结果: ${passwordMatch ? '成功' : '失败'}`);

    if (passwordMatch) {
      const { password: _password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('用户名或密码错误');
  }

  /**
   * 登录方法：验证用户后生成 JWT Token 和刷新令牌
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    console.log('登录请求参数:', {
      username: loginDto.username,
      password: '******',
    });

    const user = await this.validateUser(loginDto.username, loginDto.password);

    console.log('验证通过的用户信息:', {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles?.map((role) => role.name) || [],
    });

    // payload 包含用户ID、用户名以及角色信息，后续可用于权限校验
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles?.map((role) => role.name) || ['user'],
    };

    console.log('JWT Payload:', payload);

    // 生成刷新令牌
    const refreshToken = this.generateRefreshToken(
      payload.sub,
      payload.username,
      payload.roles,
    );

    const accessToken = this.jwtService.sign(payload);
    console.log('生成的令牌:', {
      accessToken: `${accessToken.substring(0, 20)}...`,
      refreshToken: `${refreshToken.substring(0, 10)}...`,
    });

    const responseData = {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.realName || user.username,
        username: user.username,
        roles: payload.roles,
      },
    };

    console.log('登录响应数据:', {
      ...responseData,
      accessToken: `${accessToken.substring(0, 20)}...`,
      refreshToken: `${refreshToken.substring(0, 10)}...`,
    });

    return responseData;
  }

  /**
   * 注册新用户
   */
  async register(registerDto: RegisterDto): Promise<any> {
    // 检查用户名是否已存在
    const existingUser = await this.userService.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new UnauthorizedException('该用户名已被注册');
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      username: registerDto.username,
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
    username: string,
    roles: string[],
  ): string {
    const refreshToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    this.refreshTokens.set(refreshToken, { userId, username, roles });
    return refreshToken;
  }

  /**
   * 通过刷新令牌获取新的访问令牌
   */
  refreshToken(refreshTokenDto: RefreshTokenDto): {
    accessToken: string;
    user: any;
  } {
    const tokenData = this.refreshTokens.get(refreshTokenDto.refreshToken);
    if (!tokenData) {
      throw new UnauthorizedException('刷新令牌无效');
    }

    const payload = {
      username: tokenData.username,
      sub: tokenData.userId,
      roles: tokenData.roles,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: tokenData.userId,
        name: '',
        username: tokenData.username,
        roles: tokenData.roles,
      },
    };
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

  /**
   * 获取JWT密钥信息（安全版本）
   */
  getJwtSecret(): string {
    // 不直接返回密钥，而是返回密钥的哈希摘要前6位
    const secret =
      this.configService.get<string>('JWT_SECRET') || 'hard_coded_secret_key';
    const hashedSecret = crypto
      .createHash('sha256')
      .update(secret)
      .digest('hex');
    return hashedSecret.substring(0, 6) + '...';
  }

  /**
   * 生成JWT令牌
   */
  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  /**
   * 验证JWT令牌
   */
  verifyToken(token: string): any {
    // 从configService获取密钥，避免暴露实际密钥
    const secret =
      this.configService.get<string>('JWT_SECRET') || 'hard_coded_secret_key';
    return this.jwtService.verify(token, { secret });
  }
}
