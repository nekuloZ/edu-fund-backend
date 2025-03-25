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
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StudentAidRecordService } from './student-aid-record.service';
import { CreateStudentAidRecordDto } from './dto/create-student-aid-record.dto';
import { UpdateStudentAidRecordDto } from './dto/update-student-aid-record.dto';
import { QueryStudentAidRecordDto } from './dto/query-student-aid-record.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller()
export class StudentAidRecordController {
  constructor(
    private readonly studentAidRecordService: StudentAidRecordService,
  ) {}

  /**
   * 前台接口 - 获取资助记录列表
   */
  @Get('api/front/student-aid-record/list')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取资助记录列表',
    description: '获取所有公开的资助记录列表，支持分页和筛选',
  })
  @ApiResponse({
    status: 200,
    description: '返回筛选后的学生资助记录列表及分页信息',
    schema: {
      example: {
        items: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            studentName: '张三',
            schoolName: '希望小学',
            amount: 1000,
            aidType: 'tuition',
            purpose: '支付学费',
            date: '2023-06-15T08:00:00Z',
            projectName: '教育援助计划',
          },
        ],
        meta: {
          total: 10,
          page: 1,
          limit: 10,
        },
      },
    },
  })
  async findAllForFront(@Query() queryDto: QueryStudentAidRecordDto) {
    const result = await this.studentAidRecordService.findAll(queryDto);

    // 过滤敏感信息，只返回公开的部分
    return {
      items: result.items.map((record) => ({
        id: record.id,
        studentName: record.student.name,
        schoolName: record.student.schoolName,
        amount: record.amount,
        aidType: record.aidType,
        purpose: record.purpose,
        date: record.date,
        projectName: record.project ? record.project.title : null,
      })),
      meta: result.meta,
    };
  }

  /**
   * 前台接口 - 获取资助记录详情
   */
  @Get('api/front/student-aid-record/detail/:id')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取资助记录详情',
    description: '根据资助记录ID获取详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '资助记录ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '返回单个资助记录的公开信息',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        studentName: '张三',
        schoolName: '希望小学',
        amount: 1000,
        aidType: 'tuition',
        purpose: '支付学费',
        date: '2023-06-15T08:00:00Z',
        projectName: '教育援助计划',
      },
    },
  })
  async findOneForFront(@Param('id', ParseUUIDPipe) id: string) {
    const record = await this.studentAidRecordService.findOne(id);

    // 过滤敏感信息，只返回公开的部分
    return {
      id: record.id,
      studentName: record.student.name,
      schoolName: record.student.schoolName,
      amount: record.amount,
      aidType: record.aidType,
      purpose: record.purpose,
      date: record.date,
      projectName: record.project ? record.project.title : null,
    };
  }

  /**
   * 获取学生的资助记录（前台）
   */
  @ApiTags('前台API')
  @ApiOperation({
    summary: '获取指定学生的资助记录（前台）',
    description: '根据学生ID获取该学生的所有资助记录，仅返回公开信息',
  })
  @ApiParam({
    name: 'studentId',
    description: '学生ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '返回学生的所有资助记录（仅公开信息）',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          amount: 1000,
          aidType: 'tuition',
          purpose: '支付学费',
          date: '2023-06-15T08:00:00Z',
          projectName: '教育援助计划',
        },
      ],
    },
  })
  @Get('api/front/student/:studentId/aid-records')
  async getStudentAidRecordsForFront(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    const records =
      await this.studentAidRecordService.findAllByStudent(studentId);

    // 过滤敏感信息，只返回公开的部分
    return records.map((record) => ({
      id: record.id,
      amount: record.amount,
      aidType: record.aidType,
      purpose: record.purpose,
      date: record.date,
      projectName: record.project ? record.project.title : null,
    }));
  }

  /**
   * 后台接口 - 创建资助记录
   */
  @ApiOperation({
    summary: '创建资助记录',
    description: '创建新的资助记录，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 201,
    description: '创建资助记录成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        studentId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        },
        amount: { type: 'number', example: 1000 },
        aidType: { type: 'string', example: 'tuition' },
        purpose: { type: 'string', example: '支付学费' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
        },
        status: { type: 'string', example: 'pending' },
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
        message: { type: 'string', example: '资助金额不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/student-aid-record')
  async create(
    @Body() createStudentAidRecordDto: CreateStudentAidRecordDto,
    @Request() req,
  ) {
    createStudentAidRecordDto['operatorId'] = req.user.id;
    return await this.studentAidRecordService.create(createStudentAidRecordDto);
  }

  /**
   * 后台接口 - 获取资助记录列表
   */
  @ApiOperation({
    summary: '获取资助记录列表',
    description: '获取所有资助记录列表，支持分页和查询',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取资助记录列表成功',
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
              studentId: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
              },
              amount: { type: 'number', example: 1000 },
              aidType: { type: 'string', example: 'tuition' },
              purpose: { type: 'string', example: '支付学费' },
              projectId: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
              },
              status: { type: 'string', example: 'pending' },
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
  @Get('api/admin/student-aid-records')
  async findAll() {
    const queryDto = new QueryStudentAidRecordDto();
    return await this.studentAidRecordService.findAll(queryDto);
  }

  /**
   * 后台接口 - 获取资助记录详情
   */
  @ApiOperation({
    summary: '获取资助记录详情',
    description: '获取指定资助记录的详细信息',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取资助记录详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        studentId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        },
        amount: { type: 'number', example: 1000 },
        aidType: { type: 'string', example: 'tuition' },
        purpose: { type: 'string', example: '支付学费' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
        },
        status: { type: 'string', example: 'pending' },
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
    description: '资助记录不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的资助记录' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资助记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/student-aid-record/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.studentAidRecordService.findOne(id);
  }

  /**
   * 后台接口 - 更新资助记录
   */
  @ApiOperation({
    summary: '更新资助记录',
    description: '更新资助记录信息，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '更新资助记录成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        studentId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        },
        amount: { type: 'number', example: 1000 },
        aidType: { type: 'string', example: 'tuition' },
        purpose: { type: 'string', example: '支付学费' },
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
        },
        status: { type: 'string', example: 'pending' },
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
    description: '没有权限更新资助记录',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新资助记录' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '资助记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/student-aid-record/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentAidRecordDto: UpdateStudentAidRecordDto,
  ) {
    return await this.studentAidRecordService.update(
      id,
      updateStudentAidRecordDto,
    );
  }

  /**
   * 后台接口 - 删除资助记录
   */
  @ApiOperation({
    summary: '删除资助记录',
    description: '删除指定的资助记录，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiParam({
    name: 'id',
    description: '资助记录ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      example: {
        message: '资助记录删除成功',
      },
    },
  })
  @Delete('api/admin/student-aid-record/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.studentAidRecordService.remove(id);
    return { message: '资助记录删除成功' };
  }

  /**
   * 获取学生的全部资助记录
   */
  @ApiTags('后台管理')
  @ApiOperation({
    summary: '获取学生的全部资助记录',
    description: '根据学生ID获取该学生的所有资助记录，需要管理员权限',
  })
  @ApiParam({
    name: 'studentId',
    description: '学生ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '返回学生的所有资助记录',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          studentId: '550e8400-e29b-41d4-a716-446655440000',
          projectId: '550e8400-e29b-41d4-a716-446655440002',
          amount: 1000,
          date: '2023-06-15T08:00:00Z',
          aidType: 'tuition',
          purpose: '支付学费',
          remarks: '该学生家庭经济困难',
          acknowledged: true,
          acknowledgedAt: '2023-06-20T10:00:00Z',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          studentId: '550e8400-e29b-41d4-a716-446655440000',
          projectId: '550e8400-e29b-41d4-a716-446655440004',
          amount: 500,
          date: '2023-09-01T08:00:00Z',
          aidType: 'supplies',
          purpose: '购买学习用品',
          remarks: null,
          acknowledged: false,
          acknowledgedAt: null,
        },
      ],
    },
  })
  @Get('api/admin/student/:studentId/aid-records')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getStudentAidRecords(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.studentAidRecordService.findAllByStudent(studentId);
  }

  /**
   * 获取项目的资助记录
   */
  @ApiTags('后台管理')
  @ApiOperation({
    summary: '获取项目的资助记录',
    description: '根据项目ID获取该项目的所有资助记录，需要管理员权限',
  })
  @ApiParam({
    name: 'projectId',
    description: '项目ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '返回项目的所有资助记录',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          studentId: '550e8400-e29b-41d4-a716-446655440002',
          student: {
            id: '550e8400-e29b-41d4-a716-446655440002',
            name: '张三',
            schoolName: '希望小学',
          },
          projectId: '550e8400-e29b-41d4-a716-446655440000',
          amount: 1000,
          date: '2023-06-15T08:00:00Z',
          aidType: 'tuition',
          purpose: '支付学费',
          acknowledged: true,
        },
      ],
    },
  })
  @Get('api/admin/project/:projectId/aid-records')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getProjectAidRecords(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.studentAidRecordService.findAllByProject(projectId);
  }

  /**
   * 后台接口 - 获取资助统计
   */
  @ApiOperation({
    summary: '获取资助统计',
    description: '获取资助相关的统计数据，包括总额、类型分布等',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '返回资助统计数据',
    schema: {
      example: {
        totalAmount: 150000,
        totalCount: 120,
        byType: {
          tuition: {
            amount: 80000,
            count: 60,
          },
          living: {
            amount: 40000,
            count: 40,
          },
          supplies: {
            amount: 20000,
            count: 15,
          },
          transportation: {
            amount: 5000,
            count: 3,
          },
          medical: {
            amount: 3000,
            count: 1,
          },
          other: {
            amount: 2000,
            count: 1,
          },
        },
        monthlyDistribution: [
          {
            month: '2023-01',
            amount: 15000,
            count: 12,
          },
          {
            month: '2023-02',
            amount: 12000,
            count: 10,
          },
        ],
        acknowledgementRate: 0.85,
      },
    },
  })
  @Get('api/admin/student-aid-record/statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getStatistics() {
    return this.studentAidRecordService.getStatistics();
  }
}
