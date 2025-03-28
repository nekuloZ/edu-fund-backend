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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AcademicProgressService } from './academic-progress.service';
import { CreateAcademicProgressDto } from './dto/create-academic-progress.dto';
import { UpdateAcademicProgressDto } from './dto/update-academic-progress.dto';
import { QueryAcademicProgressDto } from './dto/query-academic-progress.dto';
import { BatchCreateProgressDto } from './dto/batch-create.dto';

@Controller()
export class AcademicProgressController {
  constructor(
    private readonly academicProgressService: AcademicProgressService,
  ) {}

  // ================ 前台接口 ================

  /**
   * 获取学生的学业进展列表（前台）
   */
  @ApiTags('学业进展-前台')
  @Get('api/front/student/:studentId/academic-progress')
  async findStudentProgressForFront(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    const progressRecords =
      await this.academicProgressService.findAllByStudent(studentId);

    // 过滤敏感信息，只返回公开信息
    return progressRecords.map((record) => ({
      id: record.id,
      semester: record.semester,
      averageScore: record.averageScore,
      status: record.status,
      examDate: record.examDate,
      // 不返回详细成绩和排名信息
    }));
  }

  /**
   * 获取学生学业趋势数据（前台）
   */
  @ApiTags('学业进展-前台')
  @Get('api/front/student/:studentId/academic-trend')
  async getStudentProgressTrendForFront(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    const stats =
      await this.academicProgressService.getProgressStatistics(studentId);

    // 只返回趋势数据和最好/最差科目
    return {
      trendData: stats.trendData,
      bestSubject: stats.bestSubject,
      worstSubject: stats.worstSubject,
    };
  }

  // ================ 后台接口 ================

  /**
   * 创建学业进展记录
   */
  @ApiTags('学业进展-后台')
  @Post('api/admin/academic-progress')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createDto: CreateAcademicProgressDto) {
    return this.academicProgressService.create(createDto);
  }

  /**
   * 批量创建学业进展记录
   */
  @ApiTags('学业进展-后台')
  @Post('api/admin/academic-progress/batch')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async batchCreate(@Body() batchDto: BatchCreateProgressDto) {
    return this.academicProgressService.batchCreate(batchDto.records);
  }

  /**
   * 查询学业进展记录列表
   */
  @ApiTags('学业进展-后台')
  @Get('api/admin/academic-progress/list')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAll(@Query() queryDto: QueryAcademicProgressDto) {
    return this.academicProgressService.findAll(queryDto);
  }

  /**
   * 获取单个学业进展记录详情
   */
  @ApiTags('学业进展-后台')
  @Get('api/admin/academic-progress/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.academicProgressService.findOne(id);
  }

  /**
   * 更新学业进展记录
   */
  @ApiTags('学业进展-后台')
  @Put('api/admin/academic-progress/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAcademicProgressDto,
  ) {
    return this.academicProgressService.update(id, updateDto);
  }

  /**
   * 删除学业进展记录
   */
  @ApiTags('学业进展-后台')
  @Delete('api/admin/academic-progress/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.academicProgressService.remove(id);
    return { message: '学业进展记录删除成功' };
  }

  /**
   * 获取学生的所有学业进展记录
   */
  @ApiTags('学业进展-后台')
  @Get('api/admin/student/:studentId/academic-progress')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findStudentProgress(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.academicProgressService.findAllByStudent(studentId);
  }

  /**
   * 获取学生的最新学业进展
   */
  @ApiTags('学业进展-后台')
  @Get('api/admin/student/:studentId/latest-progress')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getLatestProgress(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.academicProgressService.getLatestProgressByStudent(studentId);
  }

  /**
   * 获取学生学业进展统计
   */
  @ApiTags('学业进展-后台')
  @Get('api/admin/student/:studentId/progress-statistics')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getProgressStatistics(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.academicProgressService.getProgressStatistics(studentId);
  }
}
