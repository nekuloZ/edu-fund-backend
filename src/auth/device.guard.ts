import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class DeviceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];

    if (!userAgent) {
      console.log('No User-Agent header found');
      throw new UnauthorizedException('User-Agent header is missing');
    }

    const isMobile = /mobile|android|touch|iphone|ipad/i.test(userAgent);
    console.log(`Device detected: ${isMobile ? 'Mobile' : 'PC'}`);

    request.isMobile = isMobile;
    return true;
  }
}
