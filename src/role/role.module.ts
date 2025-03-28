import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { FrontRoleController } from './front-role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController, FrontRoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
