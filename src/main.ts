// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('公益基金管理系统API')
    .setDescription('公益基金管理系统的API文档')
    .setVersion('1.0')
    // 移除了重复的标签，因为已经在控制器中定义了统一的ApiTags
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 创建docs目录（如果不存在）
  const docsPath = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath);
  }

  // 导出Swagger文档为JSON文件
  fs.writeFileSync(
    path.join(docsPath, 'swagger-spec.json'),
    JSON.stringify(document, null, 2),
  );
  console.log('Swagger文档已导出到 docs/swagger-spec.json');

  // 设置Swagger UI
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log('服务器运行在');
  console.log('http://localhost:3000');
  console.log('API文档');
  console.log('http://localhost:3000/api-docs');
  console.log('您也可以使用导出的JSON文件生成其他格式的文档');
}
bootstrap();
