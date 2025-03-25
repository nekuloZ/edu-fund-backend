import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseGuards,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FundAllocationService } from './fund-allocation.service';
import { CreateFundAllocationDto } from './dto/create-fund-allocation.dto';
import { UpdateFundAllocationDto } from './dto/update-fund-allocation.dto';
import { QueryFundAllocationDto } from './dto/query-fund-allocation.dto';
import { ApprovalFundAllocationDto } from './dto/approval-fund-allocation.dto';

@ApiTags('fund-allocation')
@Controller()
export class FundAllocationController {
  constructor(private readonly fundAllocationService: FundAllocationService) {}

  @ApiOperation({
    summary: '获取项目的资金分配统计',
    description: '获取指定项目的已分配资金总额',
  })
  @ApiResponse({
    status: 200,
    description: '获取项目的资金分配统计成功',
    schema: {
      type: 'object',
      properties: {
        allocatedAmount: { type: 'number', example: 50000 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '项目不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的项目' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'projectId',
    description: '项目ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @Get('api/front/fund-allocation/project/:projectId')
  async getProjectAllocations(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const amount =
      await this.fundAllocationService.getProjectAllocatedAmount(projectId);
    return { allocatedAmount: amount };
  }

  @ApiOperation({
    summary: '创建资金分配申请',
    description: '创建新的资金分配申请，需要财务或管理员权限',
  })
  @ApiResponse({
    status: 201,
    description: '创建资金分配申请成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        amount: { type: 'number', example: 10000 },
        description: { type: 'string', example: '用于项目第一阶段实施费用' },
        status: { type: 'string', example: 'pending' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误或资金不足',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '资金池余额不足' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Post('api/admin/fund/allocation')
  async create(
    @Body() createFundAllocationDto: CreateFundAllocationDto,
    @Request() req,
  ) {
    return await this.fundAllocationService.create(
      createFundAllocationDto,
      req.user.id,
    );
  }

  @ApiOperation({
    summary: '获取资金分配列表',
    description: '获取所有资金分配记录，支持多种查询条件和分页',
  })
  @ApiResponse({
    status: 200,
    description: '获取资金分配列表成功',
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
              projectId: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              amount: { type: 'number', example: 10000 },
              description: {
                type: 'string',
                example: '用于项目第一阶段实施费用',
              },
              status: { type: 'string', example: 'pending' },
              operator: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  username: { type: 'string', example: 'zhangsan' },
                },
              },
              approver: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  username: { type: 'string', example: 'admin' },
                },
                nullable: true,
              },
              approvalDate: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
                nullable: true,
              },
              approvalComment: {
                type: 'string',
                example: '同意分配资金',
                nullable: true,
              },
              createdAt: {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Get('api/admin/fund/allocation-records')
  async findAll(@Query() queryDto: QueryFundAllocationDto) {
    return await this.fundAllocationService.findAll(queryDto);
  }

  @ApiOperation({
    summary: '获取资金分配详情',
    description: '获取指定资金分配记录的详细信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取资金分配详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            title: { type: 'string', example: '希望小学建设项目' },
            description: { type: 'string', example: '为贫困地区建设希望小学' },
          },
        },
        amount: { type: 'number', example: 10000 },
        description: { type: 'string', example: '用于项目第一阶段实施费用' },
        status: { type: 'string', example: 'pending' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
            email: { type: 'string', example: 'zhangsan@example.com' },
          },
        },
        approver: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@example.com' },
          },
          nullable: true,
        },
        approvalDate: {
          type: 'string',
          example: '2024-03-25T09:30:45.123Z',
          nullable: true,
        },
        approvalComment: {
          type: 'string',
          example: '同意分配资金',
          nullable: true,
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '资金分配记录不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的资金分配记录' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资金分配记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Get('api/admin/fund/allocation/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fundAllocationService.findOne(id);
  }

  @ApiOperation({
    summary: '更新资金分配申请',
    description: '更新资金分配申请信息，仅创建者或管理员可操作',
  })
  @ApiResponse({
    status: 200,
    description: '更新资金分配申请成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        amount: { type: 'number', example: 10000 },
        description: { type: 'string', example: '用于项目第一阶段实施费用' },
        status: { type: 'string', example: 'pending' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
          },
        },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限更新此申请',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新此资金分配申请' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资金分配记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Put('api/admin/fund/allocation/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFundAllocationDto: UpdateFundAllocationDto,
    @Request() req,
  ) {
    const fundAllocation = await this.fundAllocationService.findOne(id);

    if (
      fundAllocation.operator &&
      fundAllocation.operator.id !== req.user.id &&
      !req.user.roles.includes('admin')
    ) {
      throw new ForbiddenException('您没有权限更新此资金分配申请');
    }

    return await this.fundAllocationService.update(id, updateFundAllocationDto);
  }

  @ApiOperation({
    summary: '审批资金分配申请',
    description: '审批资金分配申请，仅管理员可操作',
  })
  @ApiResponse({
    status: 200,
    description: '审批资金分配申请成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        amount: { type: 'number', example: 10000 },
        description: { type: 'string', example: '用于项目第一阶段实施费用' },
        status: { type: 'string', example: 'approved' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
          },
        },
        approver: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
          },
        },
        approvalDate: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        approvalComment: {
          type: 'string',
          example: '同意分配资金，请按计划执行',
        },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '申请状态不允许审批',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '只能审批待处理的申请' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资金分配记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/fund/allocation/:id/approve')
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approvalDto: ApprovalFundAllocationDto,
    @Request() req,
  ) {
    return await this.fundAllocationService.approve(
      id,
      approvalDto,
      req.user.id,
    );
  }

  @ApiOperation({
    summary: '取消资金分配申请',
    description: '取消资金分配申请，仅创建者或管理员可操作',
  })
  @ApiResponse({
    status: 200,
    description: '取消资金分配申请成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        amount: { type: 'number', example: 10000 },
        description: { type: 'string', example: '用于项目第一阶段实施费用' },
        status: { type: 'string', example: 'rejected' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
          },
        },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限取消此申请',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限取消此资金分配申请' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资金分配记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Put('api/admin/fund/allocation/:id/cancel')
  async cancel(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const fundAllocation = await this.fundAllocationService.findOne(id);

    if (
      fundAllocation.operator &&
      fundAllocation.operator.id !== req.user.id &&
      !req.user.roles.includes('admin')
    ) {
      throw new ForbiddenException('您没有权限取消此资金分配申请');
    }

    return await this.fundAllocationService.cancel(id);
  }

  @ApiOperation({
    summary: '标记资金分配为已完成',
    description: '将已审批的资金分配标记为已完成，仅管理员可操作',
  })
  @ApiResponse({
    status: 200,
    description: '标记资金分配为已完成成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        amount: { type: 'number', example: 10000 },
        description: { type: 'string', example: '用于项目第一阶段实施费用' },
        status: { type: 'string', example: 'completed' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
          },
        },
        approver: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
          },
        },
        approvalDate: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        approvalComment: {
          type: 'string',
          example: '同意分配资金，请按计划执行',
        },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '申请状态不允许标记为已完成',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: '只能将已审批的资金分配记录标记为已完成',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资金分配记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/fund/allocation/:id/complete')
  async markAsCompleted(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fundAllocationService.markAsCompleted(id);
  }

  @ApiOperation({
    summary: '获取资金分配统计数据',
    description: '获取资金分配相关的统计数据，包括各状态的数量和金额',
  })
  @ApiResponse({
    status: 200,
    description: '获取资金分配统计数据成功',
    schema: {
      type: 'object',
      properties: {
        totalAllocations: { type: 'number', example: 50 },
        pendingAmount: { type: 'number', example: 50000 },
        approvedAmount: { type: 'number', example: 100000 },
        completedAmount: { type: 'number', example: 80000 },
        rejectedAmount: { type: 'number', example: 20000 },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Get('api/admin/fund/allocation/statistics')
  async getStatistics() {
    return await this.fundAllocationService.getStatistics();
  }
}
