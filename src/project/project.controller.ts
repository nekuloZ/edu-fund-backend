import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { ProjectApplicationDto } from './dto/project-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * 前台接口 - 获取项目列表
   */
  @Get('api/front/project/list')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取项目列表',
    description: '获取所有公开的项目列表，支持分页、排序和筛选',
  })
  @ApiQuery({
    name: 'page',
    description: '页码，默认为1',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页数量，默认为10',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    description: '项目状态筛选',
    required: false,
    type: String,
    example: 'active',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取项目列表',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '1',
            title: '希望小学建设项目',
            description: '为贫困地区建设希望小学',
            targetAmount: 100000,
            currentAmount: 50000,
            status: 'active',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: '2',
            title: '贫困学生助学金项目',
            description: '为贫困学生提供助学金',
            targetAmount: 50000,
            currentAmount: 20000,
            status: 'active',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
        total: 10,
        page: 1,
        limit: 10,
      },
    },
  })
  async getFrontProjectList(@Query() queryDto: QueryProjectDto) {
    return await this.projectService.findAll(queryDto);
  }

  /**
   * 前台接口 - 获取项目详情
   */
  @Get('api/front/project/detail/:id')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取项目详情',
    description: '根据项目ID获取项目的详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '项目ID',
    type: String,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取项目详情',
    schema: {
      example: {
        success: true,
        data: {
          id: '1',
          title: '希望小学建设项目',
          description: '为贫困地区建设希望小学，提供基础教育资源',
          content: '<p>项目详细介绍内容...</p>',
          targetAmount: 100000,
          currentAmount: 50000,
          status: 'active',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          location: '四川省凉山州',
          images: ['image1.jpg', 'image2.jpg'],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '项目不存在',
    schema: {
      example: {
        success: false,
        message: '项目不存在',
      },
    },
  })
  async getFrontProjectDetail(@Param('id') id: string) {
    return await this.projectService.findOne(id);
  }

  /**
   * 前台接口 - 获取项目进展
   */
  @Get('api/front/project/progress/:id')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取项目进展',
    description: '根据项目ID获取项目的进展时间线信息',
  })
  @ApiParam({
    name: 'id',
    description: '项目ID',
    type: String,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取项目进展',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '1',
            title: '项目启动',
            description: '项目正式启动，开始筹集资金',
            date: '2023-01-01',
            status: 'completed',
          },
          {
            id: '2',
            title: '资金筹集',
            description: '已筹集50%目标资金',
            date: '2023-03-15',
            status: 'completed',
          },
          {
            id: '3',
            title: '项目实施',
            description: '开始实施项目建设',
            date: '2023-05-01',
            status: 'in-progress',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '项目不存在',
    schema: {
      example: {
        success: false,
        message: '项目不存在',
      },
    },
  })
  async getFrontProjectProgress(@Param('id') id: string) {
    return await this.projectService.getProjectProgress(id);
  }

  /**
   * 前台接口 - 提交项目申请
   */
  @Post('api/front/project/application')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '提交项目申请',
    description: '用户提交新项目申请，需要管理员审核通过后才会创建项目',
  })
  @ApiBody({
    type: ProjectApplicationDto,
    description: '项目申请信息',
    examples: {
      example1: {
        summary: '标准项目申请',
        description: '提交一个标准的项目申请',
        value: {
          title: '乡村教育支持计划',
          description: '为乡村学校提供教育资源支持',
          contactName: '李四',
          contactEmail: 'lisi@example.com',
          contactPhone: '13800138000',
          targetAmount: 50000,
          projectDuration: 12,
          location: '云南省昆明市',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '项目申请提交成功',
    schema: {
      example: {
        success: true,
        message: '项目申请提交成功，等待审核',
        data: {
          id: '1',
          title: '乡村教育支持计划',
          status: 'pending',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数验证失败',
    schema: {
      example: {
        success: false,
        message: '参数验证失败',
        errors: ['目标金额必须大于0', '联系电话格式不正确'],
      },
    },
  })
  async submitApplication(@Body() applicationDto: ProjectApplicationDto) {
    return await this.projectService.submitApplication(applicationDto);
  }

  /**
   * 后台接口 - 获取项目列表
   */
  @ApiOperation({
    summary: '获取项目列表',
    description: '获取所有项目列表，支持分页和查询',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取项目列表成功',
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
              title: { type: 'string', example: '希望工程助学计划' },
              description: {
                type: 'string',
                example: '为贫困地区学生提供教育资助',
              },
              targetAmount: { type: 'number', example: 100000 },
              currentAmount: { type: 'number', example: 50000 },
              startDate: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
              endDate: { type: 'string', example: '2024-12-31T23:59:59.999Z' },
              status: { type: 'string', example: 'active' },
              coverImage: {
                type: 'string',
                example: 'https://example.com/images/project.jpg',
              },
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
  @Get('api/admin/projects')
  async findAll(@Query() queryProjectDto: QueryProjectDto) {
    return await this.projectService.findAll(queryProjectDto);
  }

  /**
   * 后台接口 - 创建项目
   */
  @ApiOperation({
    summary: '创建项目',
    description: '创建新的项目，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 201,
    description: '创建项目成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        title: { type: 'string', example: '希望工程助学计划' },
        description: { type: 'string', example: '为贫困地区学生提供教育资助' },
        targetAmount: { type: 'number', example: 100000 },
        currentAmount: { type: 'number', example: 50000 },
        startDate: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        endDate: { type: 'string', example: '2024-12-31T23:59:59.999Z' },
        status: { type: 'string', example: 'active' },
        coverImage: {
          type: 'string',
          example: 'https://example.com/images/project.jpg',
        },
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
        message: { type: 'string', example: '项目标题不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/project')
  async create(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }

  /**
   * 后台接口 - 获取项目详情
   */
  @ApiOperation({
    summary: '获取项目详情',
    description: '获取指定项目的详细信息',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取项目详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        title: { type: 'string', example: '希望工程助学计划' },
        description: { type: 'string', example: '为贫困地区学生提供教育资助' },
        targetAmount: { type: 'number', example: 100000 },
        currentAmount: { type: 'number', example: 50000 },
        startDate: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        endDate: { type: 'string', example: '2024-12-31T23:59:59.999Z' },
        status: { type: 'string', example: 'active' },
        coverImage: {
          type: 'string',
          example: 'https://example.com/images/project.jpg',
        },
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
    name: 'id',
    description: '项目ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/project/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projectService.findOne(id);
  }

  /**
   * 后台接口 - 更新项目
   */
  @ApiOperation({
    summary: '更新项目信息',
    description: '更新项目信息，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '更新项目信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        title: { type: 'string', example: '希望工程助学计划' },
        description: { type: 'string', example: '为贫困地区学生提供教育资助' },
        targetAmount: { type: 'number', example: 100000 },
        currentAmount: { type: 'number', example: 50000 },
        startDate: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        endDate: { type: 'string', example: '2024-12-31T23:59:59.999Z' },
        status: { type: 'string', example: 'active' },
        coverImage: {
          type: 'string',
          example: 'https://example.com/images/project.jpg',
        },
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
    description: '没有权限更新项目信息',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新项目信息' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '项目ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/project/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.update(id, updateProjectDto);
  }

  /**
   * 后台接口 - 删除项目
   */
  @ApiOperation({
    summary: '删除项目',
    description: '删除指定的项目，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '删除项目成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '项目删除成功' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限删除项目',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限删除项目' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '项目ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/project/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.projectService.remove(id);
    return { success: true, message: '项目删除成功' };
  }

  @ApiOperation({
    summary: '获取项目统计',
    description: '获取项目相关的统计数据，包括总数、状态分布等',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取项目统计成功',
    schema: {
      type: 'object',
      properties: {
        totalProjects: { type: 'number', example: 100 },
        activeProjects: { type: 'number', example: 80 },
        completedProjects: { type: 'number', example: 20 },
        statusDistribution: {
          type: 'object',
          properties: {
            active: { type: 'number', example: 80 },
            completed: { type: 'number', example: 20 },
          },
        },
        totalDonations: { type: 'number', example: 500000 },
        averageDonation: { type: 'number', example: 5000 },
        monthlyDonations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              month: { type: 'string', example: '2024-03' },
              amount: { type: 'number', example: 50000 },
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
  @Get('api/admin/projects/statistics')
  async getStatistics() {
    return await this.projectService.getStatistics();
  }
}
