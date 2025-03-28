import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseUUIDPipe,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProjectApplicationService } from './project-application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { BatchReviewDto } from './dto/batch-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';

@Controller()
export class ProjectApplicationController {
  constructor(
    private readonly projectApplicationService: ProjectApplicationService,
  ) {}

  /**
   * 前台接口 - 提交项目申请
   */
  @Post('api/front/project-application')
  @ApiTags('项目申请-前台')
  @ApiOperation({
    summary: '提交项目申请',
    description: '用户提交新项目申请，需要管理员审核通过后才会创建项目',
  })
  @ApiResponse({
    status: 201,
    description: '提交项目申请成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectName: { type: 'string', example: '儿童教育援助计划' },
        description: { type: 'string', example: '为贫困地区儿童提供教育支持' },
        targetAmount: { type: 'number', example: 100000 },
        startDate: { type: 'string', example: '2024-04-01' },
        endDate: { type: 'string', example: '2024-12-31' },
        status: { type: 'string', example: 'pending' },
        applicant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' },
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
        message: { type: 'string', example: '项目名称不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async submitApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return await this.projectApplicationService.create(createApplicationDto);
  }

  /**
   * 前台接口 - 获取申请列表
   */
  @Get('api/front/project-application/list')
  @ApiTags('项目申请-前台')
  @ApiOperation({
    summary: '获取申请列表',
    description: '获取当前用户提交的项目申请列表，支持分页和筛选',
  })
  @ApiResponse({
    status: 200,
    description: '获取项目申请列表成功',
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
              projectName: { type: 'string', example: '儿童教育援助计划' },
              description: {
                type: 'string',
                example: '为贫困地区儿童提供教育支持',
              },
              targetAmount: { type: 'number', example: 100000 },
              startDate: { type: 'string', example: '2024-04-01' },
              endDate: { type: 'string', example: '2024-12-31' },
              status: { type: 'string', example: 'pending' },
              applicant: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  username: { type: 'string', example: 'john_doe' },
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
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    return await this.projectApplicationService.findAll(req.user.id);
  }

  /**
   * 前台接口 - 获取申请详情
   */
  @Get('api/front/project-application/detail/:id')
  @ApiTags('项目申请-前台')
  @ApiOperation({
    summary: '获取申请详情',
    description: '根据申请ID获取申请的详细信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取项目申请详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectName: { type: 'string', example: '儿童教育援助计划' },
        description: { type: 'string', example: '为贫困地区儿童提供教育支持' },
        targetAmount: { type: 'number', example: 100000 },
        startDate: { type: 'string', example: '2024-04-01' },
        endDate: { type: 'string', example: '2024-12-31' },
        status: { type: 'string', example: 'pending' },
        applicant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '项目申请不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的项目申请' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '项目申请ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() _req) {
    return await this.projectApplicationService.findOne(id);
  }

  /**
   * 后台接口 - 创建项目申请
   */
  @ApiTags('项目申请-后台')
  @ApiOperation({
    summary: '创建项目申请',
    description: '创建新的项目申请，需要管理员权限',
  })
  @Post('api/admin/project-application')
  async createProjectApplication(
    @Body() createProjectApplicationDto: CreateProjectApplicationDto,
  ) {
    return await this.projectApplicationService.create(
      createProjectApplicationDto,
    );
  }

  /**
   * 后台接口 - 获取申请列表
   */
  @ApiTags('项目申请-后台')
  @ApiOperation({
    summary: '获取申请列表',
    description: '获取所有项目申请列表，支持分页和查询',
  })
  @Get('api/admin/project-applications')
  async findAllAdmin(@Req() req) {
    return await this.projectApplicationService.findAll(req.user.id);
  }

  /**
   * 后台接口 - 获取申请详情
   */
  @ApiTags('项目申请-后台')
  @ApiOperation({
    summary: '获取申请详情',
    description: '获取指定项目申请的详细信息',
  })
  @Get('api/admin/project-application/:id')
  async findOneAdmin(@Param('id', ParseUUIDPipe) id: string, @Req() _req) {
    return await this.projectApplicationService.findOne(id);
  }

  /**
   * 后台接口 - 更新申请
   */
  @ApiTags('项目申请-后台')
  @ApiOperation({
    summary: '更新申请',
    description: '更新项目申请信息，需要管理员权限',
  })
  @Put('api/admin/project-application/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectApplicationDto: UpdateProjectApplicationDto,
    @Req() req,
  ) {
    const application = await this.projectApplicationService.findOne(id);

    // 检查用户是否有权限更新此申请
    if (application.applicant.id !== req.user.id) {
      throw new ForbiddenException('您没有权限更新此项目申请');
    }

    return await this.projectApplicationService.update(
      id,
      updateProjectApplicationDto,
    );
  }

  /**
   * 后台接口 - 审批申请
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/audit/application/approve/:id')
  async approveApplication(
    @Param('id') id: string,
    @Body() reviewDto: ReviewApplicationDto,
    @Req() req,
  ) {
    // 从请求中获取用户ID
    const reviewerId = req.user.userId;
    return await this.projectApplicationService.review(
      id,
      reviewDto,
      reviewerId,
    );
  }

  /**
   * 后台接口 - 拒绝申请
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/audit/application/reject/:id')
  async rejectApplication(
    @Param('id') id: string,
    @Body() reviewDto: ReviewApplicationDto,
    @Req() req,
  ) {
    // 设置状态为拒绝
    reviewDto.status = 'rejected';

    // 从请求中获取用户ID
    const reviewerId = req.user.userId;
    return await this.projectApplicationService.review(
      id,
      reviewDto,
      reviewerId,
    );
  }

  /**
   * 后台接口 - 批量审批
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/audit/application/batch-approve')
  async batchApproveApplications(
    @Body() batchReviewDto: BatchReviewDto,
    @Req() req,
  ) {
    // 从请求中获取用户ID
    const reviewerId = req.user.userId;
    return await this.projectApplicationService.batchReview(
      batchReviewDto,
      reviewerId,
    );
  }

  /**
   * 后台接口 - 删除申请
   */
  @ApiTags('项目申请-后台')
  @ApiOperation({
    summary: '删除申请',
    description: '删除指定的项目申请，需要管理员权限',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/project-application/:id')
  async removeApplication(@Param('id') id: string) {
    await this.projectApplicationService.remove(id);
    return { success: true, message: '申请删除成功' };
  }

  @ApiTags('项目申请-后台')
  @ApiOperation({
    summary: '获取申请统计',
    description: '获取项目申请相关的统计数据，包括总数、状态分布等',
  })
  @Get('api/admin/project-application/statistics')
  async getStatistics(@Req() req) {
    return await this.projectApplicationService.getStatistics(req.user.id);
  }
}
