import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 从装饰器获取所需角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    this.logger.log(`需要的角色: ${JSON.stringify(requiredRoles)}`);

    // 获取请求路径信息
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    this.logger.log(`请求方法: ${method}, 请求路径: ${url}`);

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.log('未设置角色要求，允许访问');
      return true;
    }

    // 获取当前用户信息
    const { user } = request;

    if (!user) {
      this.logger.error('无法获取用户信息，请求未通过JWT认证');
      return false;
    }

    this.logger.log(`用户信息: ${JSON.stringify(user)}`);
    this.logger.log(`用户角色: ${JSON.stringify(user.roles)}`);

    // 验证用户是否拥有所需角色之一
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    this.logger.log(`角色验证结果: ${hasRole}`);
    if (!hasRole) {
      this.logger.warn(
        `用户 ${user.username} 缺少所需角色: ${requiredRoles.join(', ')}`,
      );
    }

    return hasRole;
  }
}
