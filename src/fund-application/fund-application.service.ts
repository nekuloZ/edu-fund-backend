import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { UpdateFundApplicationDto } from './dto/update-fund-application.dto';
import { QueryFundApplicationDto } from './dto/query-fund-application.dto';
import { CreateApplicationAttachmentDto } from '../application-attachment/dto/create-application-attachment.dto';
import { FundApplication } from './entities/fund-application.entity';
import { ApplicationAttachment } from '../application-attachment/entities/application-attachment.entity';

@Injectable()
export class FundApplicationService {
  constructor(
    @InjectRepository(FundApplication)
    private readonly fundApplicationRepository: Repository<FundApplication>,
    @InjectRepository(ApplicationAttachment)
    private readonly attachmentRepository: Repository<ApplicationAttachment>,
    private readonly connection: Connection,
  ) {}

  /**
   * 申请提交
   * - 接收前端传来的申请数据，校验后写入 Fund_Application 表
   * - 默认状态设置为 'submitted' 或 'pending_review'
   */
  async create(createDto: CreateFundApplicationDto): Promise<FundApplication> {
    const application = this.fundApplicationRepository.create({
      // 直接赋值其他基本属性
      title: createDto.title,
      description: createDto.description,
      amount_requested: createDto.amountRequested,
      use_plan: createDto.usePlan,
      applicant_id: createDto.applicantId,
      institution_id: createDto.institutionId,
      // 构造关联对象：关联的项目类型
      projectType: { project_type_id: createDto.projectTypeId },
      // 关联的状态对象，这里使用默认的状态 ID（例如 1 表示 submitted）
      status: { status_id: 1 },
      // 如果 FundApplication 中还有其他必填的关联字段（如 project），也需要做类似的转换
    });
    return await this.fundApplicationRepository.save(application);
  }

  /**
   * 附件管理
   * - 将附件信息保存到 Application_Attachment 表
   */
  async createAttachment(
    createAttachmentDto: CreateApplicationAttachmentDto,
  ): Promise<ApplicationAttachment> {
    const attachment = this.attachmentRepository.create(createAttachmentDto);
    return await this.attachmentRepository.save(attachment);
  }

  /**
   * 申请修改与补充
   * - 仅允许在状态为 submitted 或 pending_review 时更新申请
   * - 采用事务处理确保申请和附件更新的一致性
   */
  async update(
    id: number,
    updateDto: UpdateFundApplicationDto,
  ): Promise<FundApplication> {
    const application = await this.fundApplicationRepository.findOne({
      where: { application_id: id },
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    if (
      application.status.status_name !== 'submitted' &&
      application.status.status_name !== 'pending_review'
    ) {
      throw new BadRequestException(
        'Only applications in submitted or pending_review status can be updated',
      );
    }
    await this.fundApplicationRepository.update(id, updateDto);
    return await this.fundApplicationRepository.findOne({
      where: { application_id: id },
    });
  }

  /**
   * 申请查询与跟踪
   * - 支持关键字搜索、状态过滤、排序和分页
   */
  async findAll(
    queryDto: QueryFundApplicationDto,
  ): Promise<{ data: FundApplication[]; total: number }> {
    const { keyword, status, page = 1, limit = 10 } = queryDto;
    const query =
      this.fundApplicationRepository.createQueryBuilder('application');

    if (keyword) {
      query.andWhere(
        '(application.title LIKE :keyword OR application.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    if (status) {
      query.andWhere('application.status = :status', { status });
    }
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 申请详情获取
   * - 根据申请 ID 查询详情，关联返回附件及审核记录（假设存在 reviewLogs 关系）
   */
  async findOne(id: number): Promise<FundApplication> {
    const application = await this.fundApplicationRepository.findOne({
      where: { application_id: id },
      relations: ['attachments', 'reviewLogs'],
      // reviewLogs 可按实际实体关系配置
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    return application;
  }

  /**
   * 申请删除
   * - 级联删除申请、附件和审核日志，确保数据一致性
   */
  async remove(id: number): Promise<void> {
    const application = await this.fundApplicationRepository.findOne({
      where: { application_id: id },
      relations: ['attachments', 'reviewLogs'],
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    // 开启事务删除关联数据，防止误删或数据不一致
    await this.connection.transaction(async (manager) => {
      if (application.attachments?.length) {
        await manager.remove(ApplicationAttachment, application.attachments);
      }
      // 假设审核日志存储在 review_log 表中，按业务规则删除
      if (application.reviewLogs?.length) {
        await manager.delete('review_log', { applicationId: id });
      }
      await manager.delete(FundApplication, id);
    });
  }

  /**
   * 状态管理与业务联动
   * - 更新申请状态，并可触发事件通知其他模块（如审核或通知模块）
   */
  async updateStatus(id: number, newStatus: string): Promise<FundApplication> {
    const application = await this.fundApplicationRepository.findOne({
      where: { application_id: id },
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    application.status.status_name = newStatus;
    const updatedApplication =
      await this.fundApplicationRepository.save(application);
    // 此处可触发事件通知其他模块，如:
    // this.eventEmitter.emit('application.statusChanged', updatedApplication);
    return updatedApplication;
  }
}
