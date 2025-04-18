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
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ExportUtil } from '../common/utils/export.util';
import { Response } from 'express';

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * 前台接口 - 获取学生列表
   */
  @Get('api/front/student/list')
  @ApiTags('学生模块-前台')
  @ApiOperation({
    summary: '获取学生列表',
    description: '获取所有公开的学生列表，支持分页和筛选',
  })
  @ApiResponse({
    status: 200,
    description: '返回筛选后的学生列表及分页信息',
    schema: {
      example: {
        items: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: '张三',
            gender: 'male',
            grade: '六年级',
            schoolName: '希望小学',
            address: {
              province: '广东省',
              city: '广州市',
            },
          },
        ],
        meta: {
          total: 50,
          page: 1,
          limit: 10,
        },
      },
    },
  })
  async findAllForFront(@Query() queryDto: QueryStudentDto) {
    const result = await this.studentService.findAll(queryDto);

    // 过滤敏感信息，仅返回基本信息
    return {
      items: result.items.map((student) => ({
        id: student.id,
        name: student.name,
        gender: student.gender,
        grade: student.grade,
        schoolName: student.schoolName,
        address: {
          province: student.address.province,
          city: student.address.city,
        },
      })),
      meta: result.meta,
    };
  }

  /**
   * 前台接口 - 获取学生详情
   */
  @Get('api/front/student/detail/:id')
  @ApiTags('学生模块-前台')
  @ApiOperation({
    summary: '获取学生详情',
    description: '根据学生ID获取学生的详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '学生ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '返回学生的公开信息',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: '张三',
        gender: 'male',
        grade: '六年级',
        schoolName: '希望小学',
        background: '来自农村家庭，父母均为农民，家庭经济条件较为困难',
        address: {
          province: '广东省',
          city: '广州市',
        },
      },
    },
  })
  async findOneForFront(@Param('id', ParseUUIDPipe) id: string) {
    const student = await this.studentService.findOne(id);

    // 返回有限的公开信息
    return {
      id: student.id,
      name: student.name,
      gender: student.gender,
      grade: student.grade,
      schoolName: student.schoolName,
      background: student.background,
      address: {
        province: student.address.province,
        city: student.address.city,
      },
    };
  }

  /**
   * 后台接口 - 创建学生
   */
  @ApiTags('学生模块-后台')
  @ApiOperation({
    summary: '创建学生',
    description: '创建新的学生信息，需要管理员权限',
  })
  @ApiResponse({
    status: 201,
    description: '创建成功，返回创建的学生信息',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: '张三',
        gender: 'male',
        birthdate: '2010-01-01T00:00:00Z',
        avatar: 'https://example.com/avatar.jpg',
        schoolName: '希望小学',
        grade: '六年级',
        class: '2班',
        address: {
          province: '广东省',
          city: '广州市',
          district: '天河区',
          detail: '天河路385号',
        },
        guardianName: '李四',
        guardianPhone: '13800138000',
        guardianRelationship: '父亲',
        background: '来自农村家庭，父母均为农民，家庭经济条件较为困难',
        createdAt: '2023-01-15T08:00:00Z',
        updatedAt: '2023-01-15T08:00:00Z',
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
        message: { type: 'string', example: '学生姓名不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/student')
  async create(@Body() createStudentDto: CreateStudentDto, @Request() req) {
    createStudentDto['operatorId'] = req.user.id;
    return await this.studentService.create(createStudentDto);
  }

  /**
   * 后台接口 - 获取学生列表
   */
  @ApiTags('学生模块-后台')
  @ApiOperation({
    summary: '获取学生列表',
    description: '获取所有学生列表，支持分页和查询',
  })
  @ApiResponse({
    status: 200,
    description: '返回学生列表及分页信息',
    schema: {
      example: {
        items: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: '张三',
            gender: 'male',
            birthdate: '2010-01-01T00:00:00Z',
            avatar: 'https://example.com/avatar.jpg',
            schoolName: '希望小学',
            grade: '六年级',
            class: '2班',
            address: {
              province: '广东省',
              city: '广州市',
              district: '天河区',
              detail: '天河路385号',
            },
            guardianName: '李四',
            guardianPhone: '13800138000',
            guardianRelationship: '父亲',
            background: '来自农村家庭，父母均为农民，家庭经济条件较为困难',
            createdAt: '2023-01-15T08:00:00Z',
            updatedAt: '2023-01-15T08:00:00Z',
          },
        ],
        meta: {
          total: 50,
          page: 1,
          limit: 10,
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/student/list')
  async findAll() {
    // 创建一个空的查询DTO对象
    const queryDto = new QueryStudentDto();
    return await this.studentService.findAll(queryDto);
  }

  /**
   * 后台接口 - 获取学生详情
   */
  @ApiTags('学生模块-后台')
  @ApiOperation({
    summary: '获取学生详情',
    description: '获取指定学生的详细信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取学生详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '张三' },
        studentId: { type: 'string', example: '2024001' },
        gender: { type: 'string', example: 'male' },
        age: { type: 'number', example: 18 },
        grade: { type: 'string', example: '高一' },
        school: { type: 'string', example: '第一中学' },
        address: { type: 'string', example: '北京市海淀区' },
        contactPhone: { type: 'string', example: '13800138000' },
        parentName: { type: 'string', example: '李四' },
        parentPhone: { type: 'string', example: '13900139000' },
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
    description: '学生不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的学生' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '学生ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/student/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.studentService.findOne(id);
  }

  /**
   * 后台接口 - 更新学生
   */
  @ApiTags('学生模块-后台')
  @ApiOperation({
    summary: '更新学生信息',
    description: '更新学生信息，需要管理员权限',
  })
  @ApiResponse({
    status: 200,
    description: '更新学生信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '张三' },
        studentId: { type: 'string', example: '2024001' },
        gender: { type: 'string', example: 'male' },
        age: { type: 'number', example: 18 },
        grade: { type: 'string', example: '高一' },
        school: { type: 'string', example: '第一中学' },
        address: { type: 'string', example: '北京市海淀区' },
        contactPhone: { type: 'string', example: '13800138000' },
        parentName: { type: 'string', example: '李四' },
        parentPhone: { type: 'string', example: '13900139000' },
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
    description: '没有权限更新学生信息',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新学生信息' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '学生ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/student/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentService.update(id, updateStudentDto);
  }

  /**
   * 后台接口 - 删除学生
   */
  @ApiTags('学生模块-后台')
  @ApiOperation({
    summary: '删除学生',
    description: '删除指定的学生信息，需要管理员权限',
  })
  @ApiResponse({
    status: 200,
    description: '删除学生信息成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '学生信息删除成功' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限删除学生信息',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限删除学生信息' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '学生ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/student/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.studentService.remove(id);
    return { success: true, message: '学生信息删除成功' };
  }

  /**
   * 获取学生统计
   */
  @ApiTags('学生模块-后台')
  @ApiOperation({
    summary: '获取学生统计',
    description: '获取学生相关的统计数据，包括总数、状态分布等',
  })
  @ApiResponse({
    status: 200,
    description: '返回学生统计数据',
    schema: {
      example: {
        totalCount: 500,
        genderDistribution: {
          male: 260,
          female: 235,
          other: 5,
        },
        schoolDistribution: [
          {
            schoolName: '希望小学',
            count: 120,
          },
          {
            schoolName: '育才中学',
            count: 85,
          },
        ],
        gradeDistribution: {
          一年级: 45,
          二年级: 50,
          三年级: 55,
          四年级: 60,
          五年级: 65,
          六年级: 70,
          初一: 40,
          初二: 35,
          初三: 30,
          高一: 25,
          高二: 15,
          高三: 10,
        },
        provinceDistribution: [
          {
            province: '广东省',
            count: 150,
          },
          {
            province: '云南省',
            count: 100,
          },
        ],
      },
    },
  })
  @Get('api/admin/student/statistics')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getStatistics() {
    return this.studentService.getStatistics();
  }

  @ApiOperation({
    summary: '导出学生报表',
    description: '导出学生列表数据，支持Excel和CSV格式',
  })
  @ApiResponse({
    status: 200,
    description: '导出成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({
    name: 'format',
    enum: ['excel', 'csv'],
    description: '导出格式',
    required: false,
    default: 'excel',
  })
  @ApiQuery({
    name: 'startDate',
    type: Date,
    description: '开始日期',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    type: Date,
    description: '结束日期',
    required: false,
  })
  @ApiQuery({
    name: 'hasAidRecord',
    type: Boolean,
    description: '是否有资助记录',
    required: false,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/student/export')
  async exportStudents(
    @Res() res: Response,
    @Query('format') format: 'excel' | 'csv' = 'excel',
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('hasAidRecord') hasAidRecord?: boolean,
  ) {
    const students = await this.studentService.findAll({
      startDate,
      endDate,
      hasAidRecord,
      page: 1,
      limit: 1000, // 导出时获取较大数量
    });

    const headers = [
      { key: 'name', header: '姓名' },
      { key: 'studentId', header: '学号' },
      { key: 'gender', header: '性别' },
      { key: 'age', header: '年龄' },
      { key: 'grade', header: '年级' },
      { key: 'major', header: '专业' },
      { key: 'college', header: '学院' },
      { key: 'contact', header: '联系方式' },
      { key: 'address', header: '家庭住址' },
      { key: 'hasAidRecord', header: '是否有资助记录' },
      { key: 'createdAt', header: '创建时间' },
      { key: 'updatedAt', header: '更新时间' },
    ];

    const filename = `学生报表_${new Date().toISOString().split('T')[0]}`;

    if (format === 'excel') {
      await ExportUtil.exportExcel(students.items, headers, filename, res);
    } else {
      await ExportUtil.exportCSV(students.items, headers, filename, res);
    }
  }
}
