import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const requiredRole = Reflect.getMetadata('role', context.getHandler());
    if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
