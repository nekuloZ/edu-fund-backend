import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProjectApplication } from './entities/project-application.entity';
import { Project } from '../project/entities/project.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { BatchReviewDto } from './dto/batch-review.dto';

@Injectable()
export class ProjectApplicationService {
  constructor(
    @InjectRepository(ProjectApplication)
    private applicationRepository: Repository<ProjectApplication>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  /**
   * 创建新的项目申请
   */
  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<ProjectApplication> {
    const application = this.applicationRepository.create(createApplicationDto);

    // 如果提供了项目ID，关联到对应项目
    if (createApplicationDto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: createApplicationDto.projectId },
      });

      if (!project) {
        throw new NotFoundException(
          `未找到ID为${createApplicationDto.projectId}的项目`,
        );
      }

      application.project = project;
    }

    return await this.applicationRepository.save(application);
  }

  /**
   * 查询项目申请列表（包含筛选和分页）
   */
  async findAll(queryDto: QueryApplicationDto): Promise<{
    items: ProjectApplication[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      keyword,
      status,
      projectId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.project', 'project')
      .leftJoinAndSelect('application.reviewer', 'reviewer');

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(application.applicantName LIKE :keyword OR application.applicantOrganization LIKE :keyword OR application.purpose LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 按状态筛选
    if (status) {
      if (Array.isArray(status)) {
        queryBuilder.andWhere('application.status IN (:...status)', { status });
      } else {
        queryBuilder.andWhere('application.status = :status', { status });
      }
    }

    // 按项目筛选
    if (projectId) {
      queryBuilder.andWhere('project.id = :projectId', { projectId });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页和排序
    queryBuilder
      .orderBy(`application.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const items = await queryBuilder.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 根据ID查找单个项目申请
   */
  async findOne(id: string): Promise<ProjectApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['project', 'reviewer'],
    });

    if (!application) {
      throw new NotFoundException(`未找到ID为${id}的项目申请`);
    }

    return application;
  }

  /**
   * 更新项目申请
   */
  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<ProjectApplication> {
    const application = await this.findOne(id);

    // 更新申请信息
    Object.assign(application, updateApplicationDto);

    return await this.applicationRepository.save(application);
  }

  /**
   * 审核项目申请
   */
  async review(
    id: string,
    reviewDto: ReviewApplicationDto,
    reviewerId: number,
  ): Promise<ProjectApplication> {
    const application = await this.findOne(id);

    // 如果申请已经被审核过，则不能再次审核
    if (application.status !== 'pending') {
      throw new BadRequestException('该申请已经被审核过');
    }

    // 更新审核信息
    application.status = reviewDto.status;
    application.reviewComment = reviewDto.reviewComment;
    application.reviewDate = new Date();

    // 设置审核人ID
    application.reviewer = { id: reviewerId } as any;

    return await this.applicationRepository.save(application);
  }

  /**
   * 批量审核项目申请
   */
  async batchReview(
    batchReviewDto: BatchReviewDto,
    reviewerId: number,
  ): Promise<{ success: boolean; processed: number; failed: number }> {
    const { ids, status, reviewComment } = batchReviewDto;

    // 查找所有待审核的申请
    const applications = await this.applicationRepository.find({
      where: {
        id: In(ids),
        status: 'pending',
      },
    });

    if (applications.length === 0) {
      throw new BadRequestException('未找到可审核的申请');
    }

    // 批量更新
    const reviewDate = new Date();

    for (const application of applications) {
      application.status = status;
      application.reviewComment = reviewComment;
      application.reviewDate = reviewDate;
      application.reviewer = { id: reviewerId } as any;
    }

    await this.applicationRepository.save(applications);

    return {
      success: true,
      processed: applications.length,
      failed: ids.length - applications.length,
    };
  }

  /**
   * 删除项目申请
   */
  async remove(id: string): Promise<void> {
    const application = await this.findOne(id);
    await this.applicationRepository.remove(application);
  }

  async getStatistics(_userId: string) {
    // TODO: 实现获取项目申请统计数据的逻辑
    return {
      totalApplications: 100,
      pendingApplications: 20,
      approvedApplications: 70,
      rejectedApplications: 10,
      statusDistribution: {
        pending: 20,
        approved: 70,
        rejected: 10,
      },
      monthlyApplications: [
        {
          month: '2024-03',
          count: 30,
        },
        {
          month: '2024-04',
          count: 25,
        },
      ],
    };
  }
}
