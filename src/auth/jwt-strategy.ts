import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth/jwt-payload.interface'; // 定义 JWT Payload 接口
import { UserService } from '../user/user.service'; // 用于获取用户角色

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中提取 Token
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret_key', // 设置密钥用于验证 JWT
    });
  }

  // 校验 JWT 并返回用户信息
  async validate(payload: JwtPayload) {
    const roles = await this.userService.getUserRoles(payload.sub); // 获取用户的角色
    return { userId: payload.sub, username: payload.username, roles }; // 返回用户信息和角色
  }
}
