import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 前台接口 - 获取权限列表
   */
  @Get('api/front/permission/list')
  @ApiTags('权限模块-前台')
  @ApiOperation({
    summary: '获取权限列表',
    description: '获取所有公开的权限列表，支持分页和筛选',
  })
  @UseGuards(JwtAuthGuard)
  async getFrontPermissions() {
    const queryDto = new QueryPermissionDto();
    queryDto.isActive = true;

    const { items } = await this.permissionService.findAll(queryDto);

    // 简化返回结果，只包含基本信息
    return items.map((permission) => ({
      id: permission.id,
      name: permission.name,
      code: permission.code,
      module: permission.module,
    }));
  }

  /**
   * 前台接口 - 获取权限详情
   */
  @Get('api/front/permission/detail/:id')
  @ApiTags('权限模块-前台')
  @ApiOperation({
    summary: '获取权限详情',
    description: '根据权限ID获取权限的详细信息',
  })
  @UseGuards(JwtAuthGuard)
  async getFrontPermissionDetail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Permission> {
    return await this.permissionService.findOne(id);
  }

  /**
   * 后台接口 - 创建权限
   */
  @ApiOperation({
    summary: '创建权限',
    description: '创建新的权限，需要管理员权限',
  })
  @ApiTags('权限模块-后台')
  @ApiResponse({
    status: 201,
    description: '创建权限成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: 'project:create' },
        description: { type: 'string', example: '创建项目的权限' },
        module: { type: 'string', example: 'project' },
        action: { type: 'string', example: 'create' },
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
        message: { type: 'string', example: '权限名称不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Request() _req,
  ): Promise<Permission> {
    return await this.permissionService.create(createPermissionDto);
  }

  /**
   * 后台接口 - 获取权限列表
   */
  @ApiOperation({
    summary: '获取权限列表',
    description: '获取所有权限列表，支持分页和查询',
  })
  @ApiTags('权限模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取权限列表成功',
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
              name: { type: 'string', example: 'project:create' },
              description: { type: 'string', example: '创建项目的权限' },
              module: { type: 'string', example: 'project' },
              action: { type: 'string', example: 'create' },
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
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 15 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 2 },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @Roles('admin')
  @Get()
  async findAll(@Query() queryPermissionDto: QueryPermissionDto) {
    return await this.permissionService.findAll(queryPermissionDto);
  }

  /**
   * 按模块分组获取权限
   */
  @Get('by-module')
  @Roles('admin')
  async findByModule() {
    return await this.permissionService.findByModule();
  }

  /**
   * 后台接口 - 获取权限详情
   */
  @ApiOperation({
    summary: '获取权限详情',
    description: '获取指定权限的详细信息',
  })
  @ApiTags('权限模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取权限详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: 'project:create' },
        description: { type: 'string', example: '创建项目的权限' },
        module: { type: 'string', example: 'project' },
        action: { type: 'string', example: 'create' },
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
    description: '权限不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的权限' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '权限ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Permission> {
    return await this.permissionService.findOne(id);
  }

  /**
   * 后台接口 - 更新权限
   */
  @ApiOperation({
    summary: '更新权限',
    description: '更新权限信息，需要管理员权限',
  })
  @ApiTags('权限模块-后台')
  @ApiResponse({
    status: 200,
    description: '更新权限信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: 'project:create' },
        description: { type: 'string', example: '创建项目的权限' },
        module: { type: 'string', example: 'project' },
        action: { type: 'string', example: 'create' },
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
    description: '没有权限更新此权限',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新此权限' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '权限ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @Roles('admin')
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Request() req,
  ): Promise<Permission> {
    const permission = await this.permissionService.findOne(id);

    if (
      permission.operator &&
      permission.operator.id !== req.user.id &&
      !req.user.roles.includes('admin')
    ) {
      throw new ForbiddenException('您没有权限更新此权限');
    }

    return await this.permissionService.update(id, updatePermissionDto);
  }

  /**
   * 后台接口 - 删除权限
   */
  @ApiOperation({
    summary: '删除权限',
    description: '删除指定的权限，需要管理员权限',
  })
  @ApiTags('权限模块-后台')
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.permissionService.remove(id);
  }

  @ApiOperation({
    summary: '获取权限统计',
    description: '获取权限相关的统计数据，包括总数、状态分布等',
  })
  @ApiTags('权限模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取权限统计数据成功',
    schema: {
      type: 'object',
      properties: {
        totalPermissions: { type: 'number', example: 50 },
        activePermissions: { type: 'number', example: 45 },
        inactivePermissions: { type: 'number', example: 5 },
      },
    },
  })
  @ApiBearerAuth()
  @Roles('admin')
  @Get('statistics')
  async getStatistics() {
    return await this.permissionService.getStatistics();
  }
}
