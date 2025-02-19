import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewLogService } from './review-log.service';
import { CreateReviewLogDto } from './dto/create-review-log.dto';
import { UpdateReviewLogDto } from './dto/update-review-log.dto';
import { QueryReviewLogDto } from './dto/query-review-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/review-logs')
@UseGuards(JwtAuthGuard) // 所有接口均受 JWT 保护
export class ReviewLogController {
  constructor(private readonly reviewLogService: ReviewLogService) {}

  /**
   * 审核记录提交
   * POST /api/review-logs
   * 审核人员提交审核记录，同时触发对应项目申请状态更新
   */
  @Post()
  async createReviewLog(@Body() createDto: CreateReviewLogDto) {
    return await this.reviewLogService.createReviewLog(createDto);
  }

  /**
   * 审核记录更新
   * PUT /api/review-logs/:id
   * 用于对已有审核记录进行修改（如复审时补充说明）
   */
  @Put(':id')
  async updateReviewLog(
    @Param('id') id: number,
    @Body() updateDto: UpdateReviewLogDto,
  ) {
    return await this.reviewLogService.updateReviewLog(id, updateDto);
  }

  /**
   * 审核记录查询
   * GET /api/review-logs
   * 支持根据申请ID、审核人员、审核阶段、关键字等条件进行筛选与分页查询
   */
  @Get()
  async queryReviewLogs(@Query() queryDto: QueryReviewLogDto) {
    return await this.reviewLogService.queryReviewLogs(queryDto);
  }

  /**
   * 审核记录详情获取
   * GET /api/review-logs/:id
   * 根据审核记录ID查询单条审核记录的详细信息
   */
  @Get(':id')
  async getReviewLogById(@Param('id') id: number) {
    return await this.reviewLogService.getReviewLogById(id);
  }

  /**
   * 审核记录删除
   * DELETE /api/review-logs/:id
   * 删除指定审核记录，确保数据一致性
   */
  @Delete(':id')
  async deleteReviewLog(@Param('id') id: number) {
    await this.reviewLogService.deleteReviewLog(id);
    return { message: '审核记录删除成功' };
  }
}
