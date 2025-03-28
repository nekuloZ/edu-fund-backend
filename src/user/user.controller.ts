import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignRoleDto } from './dto/assign-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 后台接口 - 创建用户
   */
  @ApiOperation({
    summary: '添加新用户',
    description: '创建新用户账号，需要管理员权限',
  })
  @ApiTags('用户模块-后台')
  @ApiResponse({
    status: 201,
    description: '创建用户成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        username: { type: 'string', example: 'zhangsan' },
        email: { type: 'string', example: 'zhangsan@example.com' },
        phone: { type: 'string', example: '13800138000' },
        role: { type: 'string', example: 'user' },
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
        message: { type: 'string', example: '用户名不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/user')
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    createUserDto['operatorId'] = req.user.id;
    return await this.userService.create(createUserDto);
  }

  /**
   * 后台接口 - 获取用户列表
   */
  @ApiOperation({
    summary: '获取用户列表',
    description: '获取所有用户的列表，支持分页和筛选，需要管理员权限',
  })
  @ApiTags('用户模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取用户列表成功',
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
              username: { type: 'string', example: 'zhangsan' },
              email: { type: 'string', example: 'zhangsan@example.com' },
              phone: { type: 'string', example: '13800138000' },
              role: { type: 'string', example: 'user' },
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
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/users')
  async findAll() {
    const queryDto = new QueryUserDto();
    return await this.userService.findAll(queryDto);
  }

  /**
   * 后台接口 - 获取用户详情
   */
  @ApiOperation({
    summary: '获取用户详情',
    description: '根据用户ID获取用户详细信息，需要管理员权限',
  })
  @ApiTags('用户模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取用户详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        username: { type: 'string', example: 'zhangsan' },
        email: { type: 'string', example: 'zhangsan@example.com' },
        phone: { type: 'string', example: '13800138000' },
        role: { type: 'string', example: 'user' },
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
    description: '用户不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的用户' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/user/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findById(id);
  }

  /**
   * 后台接口 - 更新用户
   */
  @ApiOperation({
    summary: '更新用户信息',
    description: '更新指定用户的信息，需要管理员权限',
  })
  @ApiTags('用户模块-后台')
  @ApiResponse({
    status: 200,
    description: '更新用户信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        username: { type: 'string', example: 'zhangsan' },
        email: { type: 'string', example: 'zhangsan@example.com' },
        phone: { type: 'string', example: '13800138000' },
        role: { type: 'string', example: 'user' },
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
    description: '没有权限更新用户信息',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新用户信息' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/user/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  /**
   * 后台接口 - 删除用户
   */
  @ApiOperation({
    summary: '删除用户',
    description: '删除指定的用户',
  })
  @ApiTags('用户模块-后台')
  @ApiResponse({
    status: 200,
    description: '删除用户成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '用户删除成功' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限删除用户',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限删除用户' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/user/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id);
    return { success: true, message: '用户删除成功' };
  }

  /**
   * 后台接口 - 分配用户角色
   */
  @ApiOperation({
    summary: '分配角色',
    description: '为指定用户分配角色，需要管理员权限',
  })
  @ApiTags('用户模块-后台')
  @ApiResponse({
    status: 200,
    description: '分配角色成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        username: { type: 'string', example: 'zhangsan' },
        roles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
              },
              name: { type: 'string', example: 'admin' },
            },
          },
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/user/:id/roles')
  async assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return await this.userService.assignRoles(id, assignRoleDto);
  }

  /**
   * 后台接口 - 获取用户统计
   */
  @ApiOperation({
    summary: '获取用户统计',
    description: '获取用户相关的统计数据，包括总数、角色分布等',
  })
  @ApiTags('用户模块-后台')
  @ApiResponse({
    status: 200,
    description: '获取用户统计成功',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', example: 100 },
        activeUsers: { type: 'number', example: 80 },
        inactiveUsers: { type: 'number', example: 20 },
        roleDistribution: {
          type: 'object',
          properties: {
            admin: { type: 'number', example: 5 },
            user: { type: 'number', example: 95 },
          },
        },
        statusDistribution: {
          type: 'object',
          properties: {
            active: { type: 'number', example: 80 },
            inactive: { type: 'number', example: 20 },
          },
        },
        monthlyRegistration: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              month: { type: 'string', example: '2024-03' },
              count: { type: 'number', example: 10 },
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/users/statistics')
  async getStatistics() {
    return await this.userService.getStatistics();
  }
}
