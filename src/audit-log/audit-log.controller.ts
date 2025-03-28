import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { Request } from 'express';

@ApiTags('审计日志-后台')
@Controller()
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * 创建审计日志 - 主要供内部使用，不直接暴露给前端
   */
  @ApiOperation({
    summary: '创建审计日志',
    description:
      '记录系统操作行为，包括操作类型、实体类型、变更内容等信息，通常由系统自动调用',
  })
  @ApiBody({
    type: CreateAuditLogDto,
    description: '审计日志数据',
    examples: {
      example1: {
        summary: '用户创建日志示例',
        description: '记录创建用户的操作',
        value: {
          action: 'create',
          entity: 'user',
          entityId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          newValues: {
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'admin',
          },
          userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
      },
      example2: {
        summary: '更新操作示例',
        description: '记录更新实体的操作，包含修改前后的值',
        value: {
          action: 'update',
          entity: 'project',
          entityId: 'b3c4d5e6-f7g8-9012-hijklmn345678',
          oldValues: {
            title: '希望小学建设项目',
            status: 'draft',
          },
          newValues: {
            title: '希望小学建设项目（修订版）',
            status: 'active',
          },
          userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '审计日志创建成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 123,
          action: 'create',
          entity: 'user',
          entityId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          oldValues: null,
          newValues: {
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'admin',
          },
          ip: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          createdAt: '2023-03-24T10:15:30.000Z',
        },
      },
    },
  })
  @Post('api/internal/audit-log')
  async create(
    @Body() createAuditLogDto: CreateAuditLogDto,
    @Req() req: Request,
  ) {
    // 获取客户端信息
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    // 添加客户端信息到日志
    const logData = {
      ...createAuditLogDto,
      ip,
      userAgent,
    };

    return await this.auditLogService.create(logData);
  }

  /**
   * 获取审计日志列表 - 管理员接口
   */
  @ApiOperation({
    summary: '获取审计日志列表',
    description: '管理员获取系统操作日志列表，支持多种筛选条件和分页',
  })
  @ApiQuery({
    name: 'action',
    description: '操作类型，如：create, update, delete, login',
    required: false,
    type: String,
    example: 'update',
  })
  @ApiQuery({
    name: 'entity',
    description: '实体类型，如：user, project, donation',
    required: false,
    type: String,
    example: 'user',
  })
  @ApiQuery({
    name: 'startDate',
    description: '开始日期，格式：YYYY-MM-DD',
    required: false,
    type: String,
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: '结束日期，格式：YYYY-MM-DD',
    required: false,
    type: String,
    example: '2023-12-31',
  })
  @ApiResponse({
    status: 200,
    description: '获取审计日志列表成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 123,
            action: 'create',
            entity: 'user',
            entityId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            description: '创建了新用户 张三',
            oldValues: null,
            newValues: {
              name: '张三',
              email: 'zhangsan@example.com',
            },
            ip: '192.168.1.1',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            createdAt: '2023-03-24T10:15:30.000Z',
          },
          {
            id: 124,
            action: 'update',
            entity: 'project',
            entityId: 'b3c4d5e6-f7g8-9012-hijklmn345678',
            description: '更新了项目状态',
            oldValues: {
              status: 'draft',
            },
            newValues: {
              status: 'active',
            },
            ip: '192.168.1.1',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            createdAt: '2023-03-24T10:20:15.000Z',
          },
        ],
        total: 58,
        page: 1,
        limit: 10,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/system/audit-log')
  async findAll(@Query() queryDto: QueryAuditLogDto) {
    return await this.auditLogService.findAll(queryDto);
  }

  /**
   * 获取单个审计日志 - 管理员接口
   */
  @ApiOperation({
    summary: '获取审计日志详情',
    description: '管理员根据ID获取单个审计日志的详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '审计日志ID',
    type: Number,
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: '获取审计日志详情成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 123,
          action: 'create',
          entity: 'user',
          entityId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          description: '创建了新用户 张三',
          oldValues: null,
          newValues: {
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'admin',
            department: '技术部',
          },
          ip: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          createdAt: '2023-03-24T10:15:30.000Z',
          user: {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '管理员',
            email: 'admin@example.com',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '审计日志不存在',
    schema: {
      example: {
        success: false,
        message: '审计日志不存在',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/system/audit-log/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.auditLogService.findOne(id);
  }

  /**
   * 获取最近的操作日志 - 管理员接口
   */
  @ApiOperation({
    summary: '获取最近操作日志',
    description: '管理员获取系统中最近的操作日志，用于仪表盘展示或快速查看',
  })
  @ApiQuery({
    name: 'limit',
    description: '返回记录数量限制',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '获取最近操作日志成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 125,
            action: 'login',
            entity: 'user',
            description: '用户登录',
            createdAt: '2023-03-24T11:30:45.000Z',
            user: {
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              name: '管理员',
            },
          },
          {
            id: 124,
            action: 'update',
            entity: 'project',
            description: '更新了项目状态',
            createdAt: '2023-03-24T10:20:15.000Z',
            user: {
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              name: '管理员',
            },
          },
          {
            id: 123,
            action: 'create',
            entity: 'user',
            description: '创建了新用户 张三',
            createdAt: '2023-03-24T10:15:30.000Z',
            user: {
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              name: '管理员',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/system/audit-log/recent')
  async getRecentLogs(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.auditLogService.getRecentLogs(limit);
  }

  /**
   * 获取用户操作日志 - 管理员接口
   */
  @ApiOperation({
    summary: '获取用户操作日志',
    description: '管理员获取特定用户的所有操作日志，用于用户行为分析或审计',
  })
  @ApiParam({
    name: 'userId',
    description: '用户ID',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: '获取用户操作日志成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 125,
            action: 'login',
            entity: 'user',
            description: '用户登录',
            createdAt: '2023-03-24T11:30:45.000Z',
            ip: '192.168.1.1',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          {
            id: 124,
            action: 'update',
            entity: 'project',
            entityId: 'b3c4d5e6-f7g8-9012-hijklmn345678',
            description: '更新了项目状态',
            createdAt: '2023-03-24T10:20:15.000Z',
            ip: '192.168.1.1',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        ],
        user: {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          name: '管理员',
          email: 'admin@example.com',
        },
        total: 15,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '用户不存在',
    schema: {
      example: {
        success: false,
        message: '用户不存在',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/system/audit-log/user/:userId')
  async getUserLogs(@Param('userId') userId: string) {
    return await this.auditLogService.getUserLogs(userId);
  }

  /**
   * 获取实体操作日志 - 管理员接口
   */
  @ApiOperation({
    summary: '获取实体操作日志',
    description: '管理员获取特定实体的所有操作记录，用于追踪实体变更历史',
  })
  @ApiParam({
    name: 'entity',
    description: '实体类型，如：user, project, donation',
    type: String,
    example: 'project',
  })
  @ApiParam({
    name: 'entityId',
    description: '实体ID',
    type: String,
    example: 'b3c4d5e6-f7g8-9012-hijklmn345678',
  })
  @ApiResponse({
    status: 200,
    description: '获取实体操作日志成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 127,
            action: 'update',
            entity: 'project',
            entityId: 'b3c4d5e6-f7g8-9012-hijklmn345678',
            description: '更新了项目内容',
            oldValues: {
              content: '<p>原始内容</p>',
            },
            newValues: {
              content: '<p>更新后的内容</p>',
            },
            createdAt: '2023-03-24T14:25:10.000Z',
            user: {
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              name: '管理员',
            },
          },
          {
            id: 124,
            action: 'update',
            entity: 'project',
            entityId: 'b3c4d5e6-f7g8-9012-hijklmn345678',
            description: '更新了项目状态',
            oldValues: {
              status: 'draft',
            },
            newValues: {
              status: 'active',
            },
            createdAt: '2023-03-24T10:20:15.000Z',
            user: {
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              name: '管理员',
            },
          },
          {
            id: 120,
            action: 'create',
            entity: 'project',
            entityId: 'b3c4d5e6-f7g8-9012-hijklmn345678',
            description: '创建了新项目',
            oldValues: null,
            newValues: {
              title: '希望小学建设项目',
              description: '为贫困地区建设希望小学',
            },
            createdAt: '2023-03-23T09:10:20.000Z',
            user: {
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              name: '管理员',
            },
          },
        ],
        entity: {
          type: 'project',
          id: 'b3c4d5e6-f7g8-9012-hijklmn345678',
          name: '希望小学建设项目',
        },
        total: 3,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '实体不存在',
    schema: {
      example: {
        success: false,
        message: '实体不存在',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/system/audit-log/entity/:entity/:entityId')
  async getEntityLogs(
    @Param('entity') entity: string,
    @Param('entityId') entityId: string,
  ) {
    return await this.auditLogService.getEntityLogs(entity, entityId);
  }

  /**
   * 清理过期审计日志 - 管理员接口
   */
  @ApiOperation({
    summary: '清理过期审计日志',
    description: '管理员清理指定日期之前的审计日志，用于系统维护和存储优化',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        beforeDate: {
          type: 'string',
          format: 'date',
          description: '清理该日期之前的日志',
          example: '2023-01-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '清理过期审计日志成功',
    schema: {
      example: {
        success: true,
        message: '成功清理了53条审计日志',
        data: {
          deletedCount: 53,
          beforeDate: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误',
    schema: {
      example: {
        success: false,
        message: '日期格式错误',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/system/audit-log/cleanup')
  @HttpCode(HttpStatus.OK)
  async cleanupLogs(@Body('beforeDate') beforeDate: Date) {
    return await this.auditLogService.cleanupLogs(beforeDate);
  }
}
