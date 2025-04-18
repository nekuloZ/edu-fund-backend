import { Injectable, Logger, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.debug(`请求路径: ${request.method} ${request.url}`);
    this.logger.debug(`Authorization头: ${authHeader ? '存在' : '不存在'}`);
    if (authHeader) {
      this.logger.debug(`Authorization类型: ${authHeader.split(' ')[0]}`);
      this.logger.debug(`Token长度: ${authHeader.split(' ')[1]?.length || 0}`);
    }

    return super.canActivate(context);
  }
}
