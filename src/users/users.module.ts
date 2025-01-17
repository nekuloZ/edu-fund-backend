// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 注册实体
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 确保导出 UsersService
})
export class UsersModule {}
