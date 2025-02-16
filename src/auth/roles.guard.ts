import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService, // 注入用户服务
  ) {}

  // canActivate 用于验证是否允许请求继续
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取当前路由方法上指定的角色
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // 如果没有角色要求，允许访问
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // 获取通过 JWT 校验后附加到请求的用户信息

    // 获取用户角色信息
    const roles = await this.userService.getUserRoles(user.userId);

    // 如果用户角色与要求的角色匹配，则允许访问
    return requiredRoles.some((role) => roles.includes(role));
  }
}
