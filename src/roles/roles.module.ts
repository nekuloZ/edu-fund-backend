import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity'; // Role 实体
import { Permission } from '../permissions/entities/permission.entity'; // Permission 实体

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]), // 添加 Permission 实体
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // 如果其他模块需要使用 RolesService
})
export class RolesModule {}
