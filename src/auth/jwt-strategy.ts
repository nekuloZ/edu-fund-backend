import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret =
      configService.get<string>('JWT_SECRET') || 'hard_coded_secret_key';
    super({
      // 从请求的 Authorization Bearer 中提取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 不忽略 token 过期
      secretOrKey: secret,
    });
    this.logger.log(`JWT策略初始化，使用密钥: ${secret.substring(0, 3)}...`);
  }

  /**
   * 验证通过后，将 payload 信息赋值给 req.user
   */
  async validate(payload: any) {
    this.logger.log(`JWT验证通过，payload: ${JSON.stringify(payload)}`);
    const user = {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
    this.logger.log(`请求用户信息: ${JSON.stringify(user)}`);
    return user;
  }
}
