import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './permissions.service';
import { PermissionController } from './permissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])], // 注册 TypeORM 实体
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService], // 允许其他模块使用 PermissionService
})
export class PermissionModule {}
