import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DeviceGuard } from './auth/device.guard';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new DeviceGuard());
  // 配置全局守卫
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new AuthGuard(jwtService));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
