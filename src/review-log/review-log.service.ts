import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewLog } from './entities/review-log.entity';
import { CreateReviewLogDto } from './dto/create-review-log.dto';
import { UpdateReviewLogDto } from './dto/update-review-log.dto';
import { QueryReviewLogDto } from './dto/query-review-log.dto';
import { FundApplication } from '../fund-application/entities/fund-application.entity';

@Injectable()
export class ReviewLogService {
  constructor(
    @InjectRepository(ReviewLog)
    private readonly reviewLogRepository: Repository<ReviewLog>,
    @InjectRepository(FundApplication)
    private readonly applicationRepository: Repository<FundApplication>,
  ) {}

  /**
   * 审核记录提交
   * 创建审核记录并保存，同时根据审核结果更新关联项目申请的状态。
   */
  async createReviewLog(dto: CreateReviewLogDto): Promise<ReviewLog> {
    // 查找关联的项目申请
    const application = await this.applicationRepository.findOne({
      where: { application_id: dto.application_id },
    });
    if (!application) {
      throw new NotFoundException(
        `Application with ID ${dto.application_id} not found`,
      );
    }

    // 创建审核记录
    const reviewLog = this.reviewLogRepository.create(dto);
    const savedReview = await this.reviewLogRepository.save(reviewLog);

    // 更新项目申请状态为审核结果（approved, rejected 或 needs_revision）
    application.status = dto.review_result;
    await this.applicationRepository.save(application);

    return savedReview;
  }

  /**
   * 审核记录更新
   * 根据审核记录ID更新审核信息，可用于复审时补充说明（如果业务允许修改）
   */
  async updateReviewLog(
    id: number,
    dto: UpdateReviewLogDto,
  ): Promise<ReviewLog> {
    const reviewLog = await this.reviewLogRepository.findOneBy({
      review_id: id,
    });
    if (!reviewLog) {
      throw new NotFoundException(`Review log with ID ${id} not found`);
    }
    Object.assign(reviewLog, dto);
    return await this.reviewLogRepository.save(reviewLog);
  }

  /**
   * 审核记录查询
   * 根据申请ID、审核人员ID、审核阶段及关键字进行筛选，同时支持分页查询
   */
  async queryReviewLogs(
    queryDto: QueryReviewLogDto,
  ): Promise<{ data: ReviewLog[]; total: number }> {
    const {
      application_id,
      reviewer_id,
      review_stage,
      q,
      page = 1,
      limit = 10,
    } = queryDto;
    const query = this.reviewLogRepository.createQueryBuilder('review');

    if (application_id) {
      query.andWhere('review.application_id = :application_id', {
        application_id,
      });
    }
    if (reviewer_id) {
      query.andWhere('review.reviewer_id = :reviewer_id', { reviewer_id });
    }
    if (review_stage) {
      query.andWhere('review.review_stage = :review_stage', { review_stage });
    }
    if (q) {
      query.andWhere('review.review_opinion LIKE :q', { q: `%${q}%` });
    }

    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 审核记录详情获取
   * 根据审核记录ID获取单条审核记录的详细信息
   */
  async getReviewLogById(id: number): Promise<ReviewLog> {
    const reviewLog = await this.reviewLogRepository.findOneBy({
      review_id: id,
    });
    if (!reviewLog) {
      throw new NotFoundException(`Review log with ID ${id} not found`);
    }
    return reviewLog;
  }

  /**
   * 审核记录删除
   * 删除指定审核记录，确保删除操作不会破坏数据完整性
   */
  async deleteReviewLog(id: number): Promise<void> {
    const reviewLog = await this.getReviewLogById(id);
    await this.reviewLogRepository.remove(reviewLog);
  }
}
