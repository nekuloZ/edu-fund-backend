import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PermissionService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // 创建权限
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.createPermission(
      createPermissionDto.name,
      createPermissionDto.code,
      createPermissionDto.description,
    );
  }

  // 获取所有权限
  @Get()
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    const allPermissions = await this.permissionService.findAllPermissions();

    // 计算分页数据
    const startIndex = (Number(page) - 1) * Number(pageSize);
    const paginatedPermissions = allPermissions.slice(
      startIndex,
      startIndex + Number(pageSize),
    );

    return {
      permissions: paginatedPermissions,
      total: allPermissions.length,
    };
  }

  // 根据ID获取权限
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.permissionService.findPermissionById(id);
  }

  // 更新权限
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.updatePermission(id, updatePermissionDto);
  }

  // 删除权限
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.permissionService.deletePermission(id);
  }
}
