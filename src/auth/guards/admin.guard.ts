import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 确保用户存在并已通过认证
    if (!user) {
      throw new UnauthorizedException('认证失败');
    }

    // 检查用户是否为管理员
    // 这里假设用户对象中有roles数组，或者具有isAdmin属性
    // 根据实际项目中用户角色的存储方式进行调整
    const isAdmin =
      (user.roles && user.roles.includes('admin')) || user.isAdmin === true;

    if (!isAdmin) {
      throw new UnauthorizedException('需要管理员权限');
    }

    return true;
  }
}
