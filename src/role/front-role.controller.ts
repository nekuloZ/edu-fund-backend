import { Controller, Get, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { QueryRoleDto } from './dto/query-role.dto';

@Controller('api/front/roles')
export class FrontRoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 获取公开的角色列表
   */
  @Get()
  async getFrontRoles(@Query() queryRoleDto: QueryRoleDto) {
    // 确保只返回激活状态的角色
    queryRoleDto.isActive = true;
    const result = await this.roleService.findAll(queryRoleDto);

    // 对前台返回的数据做安全处理，移除敏感信息
    return {
      ...result,
      items: result.items.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        // 不返回权限详情，只返回权限数量
        permissionCount: role.permissions?.length || 0,
      })),
    };
  }
}
