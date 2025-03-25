// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('公益基金管理系统API')
    .setDescription('公益基金管理系统的API文档')
    .setVersion('1.0')
    .addTag('auth', '认证管理')
    .addTag('front-project', '前台项目接口')
    .addTag('admin-project', '后台项目管理')
    .addTag('donation', '捐赠管理')
    .addTag('fund-pool', '资金池管理')
    .addTag('fund-allocation', '资金分配管理')
    .addTag('student', '学生管理')
    .addTag('academic-progress', '学业进度管理')
    .addTag('certificate', '证书管理')
    .addTag('document', '文档管理')
    .addTag('audit-log', '审计日志')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
  console.log('API Documentation available at http://localhost:3000/api-docs');
}
bootstrap();
