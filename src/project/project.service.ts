import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { ProjectApplicationDto } from './dto/project-application.dto';
import { ProjectApplication } from '../project-application/entities/project-application.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(ProjectApplication)
    private projectApplicationRepository: Repository<ProjectApplication>,
  ) {}

  /**
   * 创建新项目
   */
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  /**
   * 查询项目列表（包含筛选和分页）
   */
  async findAll(
    queryDto: QueryProjectDto,
  ): Promise<{ items: Project[]; total: number; page: number; limit: number }> {
    const {
      keyword,
      categories,
      status,
      province,
      city,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(project.title LIKE :keyword OR project.description LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    // 按类别筛选
    if (categories && categories.length > 0) {
      queryBuilder.andWhere('project.category && :categories', { categories });
    }

    // 按状态筛选
    if (status && status.length > 0) {
      queryBuilder.andWhere('project.status IN (:...status)', { status });
    }

    // 按地区筛选
    if (province) {
      queryBuilder.andWhere("project.location->'province' = :province", {
        province,
      });
    }

    if (city) {
      queryBuilder.andWhere("project.location->'city' = :city", { city });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页和排序
    queryBuilder
      .orderBy(`project.${sortBy}`, sortOrder)
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
   * 根据ID查找单个项目
   */
  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['timeline'],
    });

    if (!project) {
      throw new NotFoundException(`未找到ID为${id}的项目`);
    }

    return project;
  }

  /**
   * 获取项目进展
   */
  async getProjectProgress(id: string): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['timeline'],
    });

    if (!project) {
      throw new NotFoundException(`未找到ID为${id}的项目`);
    }

    // 排序时间线事件，确保按时间顺序显示
    const sortedTimeline = project.timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return {
      id: project.id,
      title: project.title,
      status: project.status,
      progress: project.progress,
      raisedAmount: project.raisedAmount,
      targetAmount: project.targetAmount,
      startDate: project.startDate,
      endDate: project.endDate,
      timeline: sortedTimeline,
    };
  }

  /**
   * 更新项目信息
   */
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);

    // 更新项目信息
    const updatedProject = Object.assign(project, updateProjectDto);

    // 如果更新了筹款金额，重新计算进度
    if (updateProjectDto.raisedAmount !== undefined) {
      updatedProject.progress = Number(
        (
          (updatedProject.raisedAmount / updatedProject.targetAmount) *
          100
        ).toFixed(2),
      );
    }

    return await this.projectRepository.save(updatedProject);
  }

  /**
   * 删除项目
   */
  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  /**
   * 提交项目申请
   */
  async submitApplication(
    applicationDto: ProjectApplicationDto,
  ): Promise<ProjectApplication> {
    const application = this.projectApplicationRepository.create({
      applicantName: applicationDto.applicantName,
      applicantOrganization: applicationDto.title,
      applicantEmail: applicationDto.contactEmail,
      applicantPhone: applicationDto.contactPhone,
      requestedAmount: applicationDto.targetAmount,
      purpose: applicationDto.description,
      details: {
        category: applicationDto.category,
        content: applicationDto.content,
        attachments: applicationDto.attachments,
        location:
          applicationDto.province && applicationDto.city
            ? {
                province: applicationDto.province,
                city: applicationDto.city,
              }
            : null,
      },
      status: 'pending',
    });

    return await this.projectApplicationRepository.save(application);
  }

  async getStatistics() {
    // TODO: 实现获取项目统计数据的逻辑
    return {
      totalProjects: 100,
      activeProjects: 80,
      completedProjects: 20,
      statusDistribution: {
        active: 80,
        completed: 20,
      },
      totalDonations: 500000,
      averageDonation: 5000,
      monthlyDonations: [
        {
          month: '2024-03',
          amount: 50000,
          count: 10,
        },
      ],
    };
  }
}
