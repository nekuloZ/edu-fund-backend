import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  ParseFloatPipe,
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
import { FundPoolService } from './fund-pool.service';
import { UpdateFundPoolDto } from './dto/update-fund-pool.dto';
import { AdjustBalanceDto } from './dto/adjust-balance.dto';
import { SetWarningLineDto } from './dto/set-warning-line.dto';
import { CreateFundPoolDto } from './dto/create-fund-pool.dto';

@ApiTags('资金池-前台和后台')
@Controller()
export class FundPoolController {
  constructor(private readonly fundPoolService: FundPoolService) {}

  // ------------ 前台接口 ------------

  @ApiOperation({ summary: '获取资金池状态' })
  @ApiResponse({ status: 200, description: '获取资金池状态成功' })
  @Get('api/front/fund-pool/status')
  async getFundStatus() {
    return await this.fundPoolService.getFundStatus();
  }

  // ------------ 后台接口 ------------

  @ApiOperation({
    summary: '创建资金池',
    description: '创建新的资金池，需要管理员权限',
  })
  @ApiResponse({
    status: 201,
    description: '创建资金池成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '2024年度慈善基金池' },
        description: {
          type: 'string',
          example: '用于2024年度慈善项目的资金池',
        },
        balance: { type: 'number', example: 1000000 },
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
        message: { type: 'string', example: '资金池名称不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/fund/pool')
  async create(@Body() createFundPoolDto: CreateFundPoolDto, @Request() req) {
    return await this.fundPoolService.create(createFundPoolDto, req.user.id);
  }

  @ApiOperation({
    summary: '获取资金池列表',
    description: '获取所有资金池记录，需要管理员或财务权限',
  })
  @ApiResponse({
    status: 200,
    description: '获取资金池列表成功',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          name: { type: 'string', example: '2024年度慈善基金池' },
          description: {
            type: 'string',
            example: '用于2024年度慈善项目的资金池',
          },
          balance: { type: 'number', example: 1000000 },
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
          updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Get('api/admin/fund/pools')
  async findAll() {
    return await this.fundPoolService.findAll();
  }

  @ApiOperation({
    summary: '获取资金池详情',
    description: '获取指定资金池的详细信息，需要管理员或财务权限',
  })
  @ApiResponse({
    status: 200,
    description: '获取资金池详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '2024年度慈善基金池' },
        description: {
          type: 'string',
          example: '用于2024年度慈善项目的资金池',
        },
        balance: { type: 'number', example: 1000000 },
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
    description: '资金池不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的资金池' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资金池ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Get('api/admin/fund/pool/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fundPoolService.findOne(id);
  }

  @ApiOperation({
    summary: '更新资金池信息',
    description: '更新资金池信息，仅管理员可操作',
  })
  @ApiResponse({
    status: 200,
    description: '更新资金池信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '2024年度慈善基金池' },
        description: {
          type: 'string',
          example: '用于2024年度慈善项目的资金池',
        },
        balance: { type: 'number', example: 1000000 },
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
    description: '没有权限更新此资金池',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新此资金池' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资金池ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/fund/pool/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFundPoolDto: UpdateFundPoolDto,
    @Request() req,
  ) {
    const fundPool = await this.fundPoolService.findOne(id);

    if (
      fundPool.operator &&
      fundPool.operator.id !== req.user.id &&
      !req.user.roles.includes('admin')
    ) {
      throw new ForbiddenException('您没有权限更新此资金池');
    }

    return await this.fundPoolService.update(id, updateFundPoolDto);
  }

  @ApiOperation({
    summary: '获取资金池统计数据',
    description: '获取资金池相关的统计数据，包括总余额和各状态的数量',
  })
  @ApiResponse({
    status: 200,
    description: '获取资金池统计数据成功',
    schema: {
      type: 'object',
      properties: {
        totalBalance: { type: 'number', example: 5000000 },
        activePools: { type: 'number', example: 3 },
        inactivePools: { type: 'number', example: 1 },
        totalPools: { type: 'number', example: 4 },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'financial')
  @Get('api/admin/fund/pool/statistics')
  async getStatistics() {
    return await this.fundPoolService.getStatistics();
  }

  @ApiOperation({ summary: '获取资金池信息' })
  @ApiResponse({ status: 200, description: '获取资金池信息成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/fund/balance')
  async getFundPool() {
    return await this.fundPoolService.getFundPool();
  }

  @ApiOperation({ summary: '调整资金余额' })
  @ApiResponse({ status: 200, description: '调整资金余额成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/fund/adjust-balance')
  async adjustBalance(@Body() adjustBalanceDto: AdjustBalanceDto) {
    return await this.fundPoolService.adjustBalance(adjustBalanceDto);
  }

  @ApiOperation({ summary: '设置警戒线' })
  @ApiResponse({ status: 200, description: '设置警戒线成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/fund/warning-line')
  async setWarningLine(@Body() setWarningLineDto: SetWarningLineDto) {
    return await this.fundPoolService.setWarningLine(setWarningLineDto);
  }

  @ApiOperation({ summary: '预分配资金' })
  @ApiResponse({ status: 200, description: '预分配资金成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/fund/allocate/:amount')
  async allocateFunds(@Param('amount', ParseFloatPipe) amount: number) {
    return await this.fundPoolService.allocateFunds(amount);
  }

  @ApiOperation({ summary: '取消资金分配' })
  @ApiResponse({ status: 200, description: '取消资金分配成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/fund/deallocate/:amount')
  async deallocateFunds(@Param('amount', ParseFloatPipe) amount: number) {
    return await this.fundPoolService.deallocateFunds(amount);
  }

  @ApiOperation({ summary: '标记待处理金额' })
  @ApiResponse({ status: 200, description: '标记待处理金额成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/fund/mark-pending/:amount')
  async markPendingAmount(@Param('amount', ParseFloatPipe) amount: number) {
    return await this.fundPoolService.markPendingAmount(amount);
  }

  @ApiOperation({ summary: '取消待处理金额' })
  @ApiResponse({ status: 200, description: '取消待处理金额成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/fund/unmark-pending/:amount')
  async unmarkPendingAmount(@Param('amount', ParseFloatPipe) amount: number) {
    return await this.fundPoolService.unmarkPendingAmount(amount);
  }
}
