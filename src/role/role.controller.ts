import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/roles')
@UseGuards(JwtAuthGuard) // 整个控制器均受 JWT 保护，只有认证用户才能调用
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 角色列表查询
   * GET /api/roles
   * 支持通过查询参数进行关键字搜索、排序和分页
   */
  @Get()
  async getRoles(@Query() query: QueryRoleDto) {
    return await this.roleService.queryRoles(query);
  }

  /**
   * 角色详情获取
   * GET /api/roles/:id
   * 根据角色 ID 获取角色详细信息，包括关联的权限数据
   */
  @Get(':id')
  async getRoleById(@Param('id') id: number) {
    return await this.roleService.getRoleById(id);
  }

  /**
   * 角色创建
   * POST /api/roles
   * 创建新角色并保存到数据库中
   */
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.createRole(createRoleDto);
  }

  /**
   * 角色信息更新
   * PUT /api/roles/:id
   * 根据角色 ID 更新角色名称、描述等信息
   */
  @Put(':id')
  async updateRole(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.roleService.updateRole(id, updateRoleDto);
  }

  /**
   * 角色删除
   * DELETE /api/roles/:id
   * 删除角色，同时级联清除用户与权限关联数据
   */
  @Delete(':id')
  async deleteRole(@Param('id') id: number) {
    await this.roleService.deleteRole(id);
    return { message: '角色删除成功' };
  }

  /**
   * 角色与权限关联管理
   * POST /api/roles/:id/permissions
   * 为指定角色分配权限（传入权限ID数组），实现增加或移除权限的功能
   */
  @Post(':id/permissions')
  async assignPermissions(
    @Param('id') id: number,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return await this.roleService.assignPermissions(id, assignPermissionDto);
  }
}
