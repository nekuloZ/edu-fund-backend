import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 前台接口 - 获取角色列表
   */
  @Get('api/front/role/list')
  @ApiTags('角色模块-前台')
  @ApiOperation({
    summary: '获取角色列表',
    description: '获取所有公开的角色列表，支持分页和筛选',
  })
  async findAll() {
    return await this.roleService.findAll({});
  }

  /**
   * 前台接口 - 获取角色详情
   */
  @Get('api/front/role/detail/:id')
  @ApiTags('角色模块-前台')
  @ApiOperation({
    summary: '获取角色详情',
    description: '根据角色ID获取角色的详细信息',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.roleService.findById(Number(id));
  }

  /**
   * 后台接口 - 创建角色
   */
  @ApiOperation({
    summary: '创建角色',
    description: '创建新的角色，需要管理员权限',
  })
  @ApiTags('角色模块-后台')
  @ApiResponse({
    status: 201,
    description: '创建角色成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: 'editor' },
        description: { type: 'string', example: '内容编辑' },
        permissions: {
          type: 'array',
          items: {
            type: 'string',
            example: 'content:edit',
          },
        },
        status: { type: 'string', example: 'active' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '角色名称不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/role')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  /**
   * 后台接口 - 获取角色列表
   */
  @ApiOperation({
    summary: '获取角色列表',
    description: '获取所有角色列表，支持分页和查询',
  })
  @ApiTags('角色模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取角色列表成功',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              name: { type: 'string', example: 'editor' },
              description: { type: 'string', example: '内容编辑' },
              permissions: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'content:edit',
                },
              },
              status: { type: 'string', example: 'active' },
              operator: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  username: { type: 'string', example: 'admin' },
                },
              },
              createdAt: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/roles')
  async findAllAdmin() {
    return await this.roleService.findAll({});
  }

  /**
   * 后台接口 - 获取角色详情
   */
  @ApiOperation({
    summary: '获取角色详情',
    description: '获取指定角色的详细信息',
  })
  @ApiTags('角色模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取角色详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: 'editor' },
        description: { type: 'string', example: '内容编辑' },
        permissions: {
          type: 'array',
          items: {
            type: 'string',
            example: 'content:edit',
          },
        },
        status: { type: 'string', example: 'active' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@example.com' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '角色不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的角色' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '角色ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/role/:id')
  async findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return await this.roleService.findById(Number(id));
  }

  /**
   * 后台接口 - 更新角色
   */
  @ApiOperation({
    summary: '更新角色',
    description: '更新角色信息，需要管理员权限',
  })
  @ApiTags('角色模块-后台')
  @ApiResponse({
    status: 200,
    description: '更新角色信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: 'editor' },
        description: { type: 'string', example: '内容编辑' },
        permissions: {
          type: 'array',
          items: {
            type: 'string',
            example: 'content:edit',
          },
        },
        status: { type: 'string', example: 'active' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
          },
        },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限更新角色',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新角色' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '角色ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/role/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.roleService.update(Number(id), updateRoleDto);
  }

  /**
   * 后台接口 - 删除角色
   */
  @ApiOperation({
    summary: '删除角色',
    description: '删除指定的角色，需要管理员权限',
  })
  @ApiTags('角色模块-后台')
  @ApiResponse({
    status: 200,
    description: '删除角色成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '角色删除成功' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限删除角色',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限删除角色' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '角色ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/role/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.roleService.remove(Number(id));
    return { success: true, message: '角色删除成功' };
  }

  /**
   * 分配权限
   */
  @Put(':id/permissions')
  @Roles('admin')
  async assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignPermissionDto: AssignPermissionDto,
  ): Promise<Role> {
    return await this.roleService.assignPermissions(id, assignPermissionDto);
  }

  /**
   * 后台接口 - 获取角色统计
   */
  @ApiOperation({
    summary: '获取角色统计',
    description: '获取角色相关的统计数据，包括总数、状态分布等',
  })
  @ApiTags('角色模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取角色统计数据成功',
    schema: {
      type: 'object',
      properties: {
        totalRoles: { type: 'number', example: 10 },
        activeRoles: { type: 'number', example: 8 },
        inactiveRoles: { type: 'number', example: 2 },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/role/statistics')
  async getStatistics() {
    const roles = await this.roleService.findAll({});
    return {
      totalRoles: roles.total,
      activeRoles: roles.items.filter((role) => role.isActive).length,
      inactiveRoles: roles.items.filter((role) => !role.isActive).length,
    };
  }
}
