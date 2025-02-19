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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/permissions')
@UseGuards(JwtAuthGuard) // 整个控制器受 JWT 认证保护
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 权限列表查询
   * GET /api/permissions
   * 支持通过查询参数进行关键字搜索、排序和分页
   */
  @Get()
  async getPermissions(@Query() query: QueryPermissionDto) {
    return await this.permissionService.queryPermissions(query);
  }

  /**
   * 权限详情获取
   * GET /api/permissions/:id
   * 根据权限 ID 获取单个权限的详细信息
   */
  @Get(':id')
  async getPermissionById(@Param('id') id: number) {
    return await this.permissionService.getPermissionById(id);
  }

  /**
   * 权限创建
   * POST /api/permissions
   * 根据传入的 CreatePermissionDto 创建新权限项
   */
  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  /**
   * 权限更新
   * PUT /api/permissions/:id
   * 根据权限 ID 更新权限名称或描述等信息
   */
  @Put(':id')
  async updatePermission(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.updatePermission(
      id,
      updatePermissionDto,
    );
  }

  /**
   * 权限删除
   * DELETE /api/permissions/:id
   * 删除权限，同时自动同步清除与角色的关联记录
   */
  @Delete(':id')
  async deletePermission(@Param('id') id: number) {
    await this.permissionService.deletePermission(id);
    return { message: '权限删除成功' };
  }
}
