import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DeviceGuard } from './auth/device.guard';
// import { AuthGuard } from './auth/auth.guard';
// import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new DeviceGuard());
  // 配置全局守卫
  // const jwtService = app.get(JwtService);
  // app.useGlobalGuards(new AuthGuard(jwtService));

  // 添加 CORS 配置
  app.enableCors({
    origin: 'http://localhost:5173', // 前端开发服务器地址
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
