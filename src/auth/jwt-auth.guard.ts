import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

// JWT 认证守卫
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {} // 依赖注入 JwtService

  // 在每个请求中检查 JWT Token 是否有效
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request); // 从请求头提取 Token

    if (!token) {
      throw new Error('No token found');
    }

    try {
      // 使用 JWT 服务验证 Token 是否有效
      const payload = this.jwtService.verify(token); // 如果 Token 无效，这里会抛出错误
      request.user = payload; // 将有效的用户信息附加到请求对象上，供后续处理
      return true;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // 从请求头中提取 Token
  private extractTokenFromHeader(request: any): string | null {
    const bearerToken = request.headers['authorization'];
    if (bearerToken && bearerToken.startsWith('Bearer ')) {
      return bearerToken.split(' ')[1]; // 提取 Token
    }
    return null;
  }
}
