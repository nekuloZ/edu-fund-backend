# 公益基金管理系统

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 项目简介

这是一个基于 NestJS 框架开发的公益基金管理系统后端服务。系统提供了完整的公益基金管理功能，包括项目管理、资金管理、用户管理等核心功能。

## 技术栈

- NestJS - 后端框架
- TypeScript - 开发语言
- MySQL - 数据库
- TypeORM - ORM框架
- Swagger - API文档

## 项目设置

```bash
# 安装依赖
$ npm install

# 配置环境变量
# 复制 .env.example 到 .env 并填写相应的配置信息
```

## 运行项目

```bash
# 开发环境
$ npm run start:dev

# 生产环境
$ npm run start:prod
```

## API 文档

项目集成了 Swagger 文档，可以通过以下方式访问：

- 开发环境：访问 `http://localhost:3000/api-docs`
- API 文档 JSON 文件位置：`docs/swagger-spec.json`

## 主要功能

- 项目管理
- 资金管理
- 用户管理
- 审计日志
- 权限控制

## 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 进行代码规范控制：

```bash
# 代码格式化
$ npm run format

# 代码检查
$ npm run lint
```

### 测试

```bash
# 单元测试
$ npm run test

# 测试覆盖率
$ npm run test:cov
```

## 部署

项目支持多种部署方式，推荐使用 Docker 进行容器化部署。详细的部署文档请参考部署指南。

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

[MIT licensed](LICENSE)
