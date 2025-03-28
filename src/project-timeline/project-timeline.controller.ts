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
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectTimelineService } from './project-timeline.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProjectTimelineDto } from './dto/create-project-timeline.dto';
import { UpdateProjectTimelineDto } from './dto/update-project-timeline.dto';
import { QueryTimelineDto } from './dto/query-timeline.dto';

@Controller()
export class ProjectTimelineController {
  constructor(private readonly timelineService: ProjectTimelineService) {}

  /**
   * 前台接口 - 获取项目时间线
   */
  @ApiTags('项目时间线-前台')
  @Get('api/front/project/timeline/:projectId')
  async getFrontTimeline(@Param('projectId') projectId: string) {
    return await this.timelineService.findByProjectId(projectId);
  }

  /**
   * 前台接口 - 获取时间线事件详情
   */
  @ApiTags('项目时间线-前台')
  @Get('api/front/project/timeline/event/:id')
  async getFrontTimelineEvent(@Param('id') id: string) {
    return await this.timelineService.findOne(id);
  }

  /**
   * 后台接口 - 获取时间线事件列表
   */
  @ApiTags('项目时间线-后台')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/project/timeline/list')
  async getAdminTimelineList(@Query() queryDto: QueryTimelineDto) {
    return await this.timelineService.findAll(queryDto);
  }

  /**
   * 后台接口 - 获取指定项目的时间线
   */
  @ApiTags('项目时间线-后台')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/project/timeline/:projectId')
  async getProjectTimeline(@Param('projectId') projectId: string) {
    return await this.timelineService.findByProjectId(projectId);
  }

  /**
   * 后台接口 - 获取时间线事件详情
   */
  @ApiTags('项目时间线-后台')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/project/timeline/event/:id')
  async getTimelineEvent(@Param('id') id: string) {
    return await this.timelineService.findOne(id);
  }

  @ApiOperation({
    summary: '创建项目时间线',
    description: '创建新的项目时间线记录，需要管理员权限',
  })
  @ApiResponse({
    status: 201,
    description: '创建项目时间线成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        title: { type: 'string', example: '项目启动会议' },
        description: {
          type: 'string',
          example: '召开项目启动会议，确定项目目标和计划',
        },
        date: { type: 'string', example: '2024-04-01' },
        type: { type: 'string', example: 'milestone' },
        status: { type: 'string', example: 'completed' },
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
        message: { type: 'string', example: '标题不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiTags('项目时间线-后台')
  @Post('api/admin/project-timeline')
  async create(
    @Body() createProjectTimelineDto: CreateProjectTimelineDto,
    @Req() req,
  ) {
    if (!createProjectTimelineDto.description) {
      createProjectTimelineDto.description = '';
    }
    createProjectTimelineDto['operatorId'] = req.user.id;
    return await this.timelineService.create(createProjectTimelineDto as any);
  }

  @ApiOperation({
    summary: '获取项目时间线列表',
    description: '获取指定项目的所有时间线记录',
  })
  @ApiResponse({
    status: 200,
    description: '获取项目时间线列表成功',
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
              title: { type: 'string', example: '项目启动会议' },
              description: {
                type: 'string',
                example: '召开项目启动会议，确定项目目标和计划',
              },
              date: { type: 'string', example: '2024-04-01' },
              type: { type: 'string', example: 'milestone' },
              status: { type: 'string', example: 'completed' },
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
  @ApiParam({
    name: 'projectId',
    description: '项目ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @Get('api/front/project-timeline/:projectId')
  async findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return await this.timelineService.findByProjectId(projectId);
  }

  @ApiOperation({
    summary: '获取时间线详情',
    description: '获取指定时间线记录的详细信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取时间线详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        title: { type: 'string', example: '项目启动会议' },
        description: {
          type: 'string',
          example: '召开项目启动会议，确定项目目标和计划',
        },
        date: { type: 'string', example: '2024-04-01' },
        type: { type: 'string', example: 'milestone' },
        status: { type: 'string', example: 'completed' },
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
    description: '时间线记录不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的时间线记录' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '时间线记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @Get('api/front/project-timeline/detail/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.timelineService.findOne(id);
  }

  @ApiOperation({
    summary: '更新时间线信息',
    description: '更新时间线记录信息，需要管理员权限',
  })
  @ApiResponse({
    status: 200,
    description: '更新时间线信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        title: { type: 'string', example: '项目启动会议' },
        description: {
          type: 'string',
          example: '召开项目启动会议，确定项目目标和计划',
        },
        date: { type: 'string', example: '2024-04-01' },
        type: { type: 'string', example: 'milestone' },
        status: { type: 'string', example: 'completed' },
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
    description: '没有权限更新时间线',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新时间线' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '时间线记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/project-timeline/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectTimelineDto: UpdateProjectTimelineDto,
  ) {
    return await this.timelineService.update(id, updateProjectTimelineDto);
  }

  @ApiOperation({
    summary: '删除时间线记录',
    description: '删除指定的时间线记录，需要管理员权限',
  })
  @ApiResponse({
    status: 200,
    description: '删除时间线记录成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '时间线记录删除成功' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限删除时间线',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限删除时间线' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '时间线记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/project-timeline/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.timelineService.remove(id);
    return { success: true, message: '时间线记录删除成功' };
  }
}
