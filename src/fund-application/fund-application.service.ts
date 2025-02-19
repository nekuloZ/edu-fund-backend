import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundApplication } from './entities/fund-application.entity';
import { ApplicationAttachment } from '../application-attachment/entities/application-attachment.entity';
import { ReviewLog } from '../review-log/entities/review-log.entity';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { UpdateFundApplicationDto } from './dto/update-fund-application.dto';
import { QueryFundApplicationDto } from './dto/query-fund-application.dto';

@Injectable()
export class FundApplicationService {
  constructor(
    @InjectRepository(FundApplication)
    private readonly applicationRepository: Repository<FundApplication>,

    @InjectRepository(ApplicationAttachment)
    private readonly attachmentRepository: Repository<ApplicationAttachment>,

    @InjectRepository(ReviewLog)
    private readonly reviewRepository: Repository<ReviewLog>,
  ) {}

  /**
   * 提交新的项目申请
   * 根据传入的 CreateFundApplicationDto 创建 FundApplication 记录，
   * 同时将状态初始化为 "submitted"（业务上也可以选择 "pending_review"）。
   */
  async createApplication(
    createDto: CreateFundApplicationDto,
    // 如果附件信息同时上传，可以额外传入附件数组（可选）
    attachmentData?: { file_path: string; file_type?: string }[],
  ): Promise<FundApplication> {
    // 创建项目申请记录
    const application = this.applicationRepository.create({
      ...createDto,
      status: 'submitted', // 或 'pending_review'，可根据业务需求调整
    });
    const savedApplication = await this.applicationRepository.save(application);

    // 如果存在附件信息，则依次创建附件记录
    if (attachmentData && attachmentData.length > 0) {
      const attachments = attachmentData.map((att) =>
        this.attachmentRepository.create({
          application: savedApplication, // 关联当前申请记录（假设实体关系已定义）
          file_path: att.file_path,
          file_type: att.file_type,
        }),
      );
      await this.attachmentRepository.save(attachments);
      // 可将附件信息附加到返回的申请记录中
      savedApplication.attachments = attachments;
    }
    return savedApplication;
  }

  /**
   * 更新项目申请（修改与补充）
   * 仅允许在申请状态为 "submitted" 或 "pending_review" 的情况下更新
   */
  async updateApplication(
    id: number,
    updateDto: UpdateFundApplicationDto,
  ): Promise<FundApplication> {
    const application = await this.applicationRepository.findOne({
      where: { application_id: id },
    });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    // 仅允许在允许修改的状态下进行更新
    if (!['submitted', 'pending_review'].includes(application.status)) {
      throw new BadRequestException(
        'Only applications with status submitted or pending_review can be updated',
      );
    }
    Object.assign(application, updateDto);
    return await this.applicationRepository.save(application);
  }

  /**
   * 查询项目申请列表
   * 支持关键字搜索、状态过滤、项目类型筛选、排序和分页
   */
  async queryApplications(
    queryDto: QueryFundApplicationDto,
  ): Promise<{ data: FundApplication[]; total: number }> {
    const { q, status, project_type, page = 1, limit = 10, sort } = queryDto;
    const query = this.applicationRepository.createQueryBuilder('application');

    // 关键字搜索（匹配标题或描述）
    if (q) {
      query.andWhere(
        'application.title LIKE :q OR application.description LIKE :q',
        { q: `%${q}%` },
      );
    }
    // 状态过滤
    if (status) {
      query.andWhere('application.status = :status', { status });
    }
    // 项目类型筛选
    if (project_type) {
      query.andWhere('application.project_type = :project_type', {
        project_type,
      });
    }
    // 排序，例如 "submission_date:desc" 或 "amount_requested:asc"
    if (sort) {
      const [field, order] = sort.split(':');
      query.orderBy(
        `application.${field}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    }
    // 分页处理
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 获取单个项目申请详情
   * 同时加载附件和审核记录（假设 FundApplication 实体中配置了相应关系）
   */
  async getApplicationById(id: number): Promise<FundApplication> {
    const application = await this.applicationRepository.findOne({
      where: { application_id: id },
      relations: ['attachments', 'reviews'], // 假设关联关系名称分别为 attachments 和 reviews
    });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return application;
  }

  /**
   * 删除项目申请
   * 删除时同时清理相关附件和审核记录，确保数据一致性
   * 可在删除前增加关联数据校验，防止误删正在处理的申请
   */
  async deleteApplication(id: number): Promise<void> {
    const application = await this.getApplicationById(id);
    // 可根据需求添加判断逻辑，如仅允许删除特定状态的申请
    // 此处直接删除，TypeORM 级联设置（或手动删除附件、审核记录）确保数据一致性
    await this.applicationRepository.remove(application);
  }
}
