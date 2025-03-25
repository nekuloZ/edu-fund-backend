import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTimeline } from './entities/project-timeline.entity';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { QueryTimelineDto } from './dto/query-timeline.dto';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class ProjectTimelineService {
  constructor(
    @InjectRepository(ProjectTimeline)
    private timelineRepository: Repository<ProjectTimeline>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  /**
   * 创建新的项目时间线事件
   */
  async create(createTimelineDto: CreateTimelineDto): Promise<ProjectTimeline> {
    // 查找项目是否存在
    const project = await this.projectRepository.findOne({
      where: { id: createTimelineDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `未找到ID为${createTimelineDto.projectId}的项目`,
      );
    }

    // 创建新的时间线事件
    const timeline = this.timelineRepository.create({
      date: createTimelineDto.date,
      title: createTimelineDto.title,
      description: createTimelineDto.description,
      images: createTimelineDto.images,
      project, // 关联项目
    });

    return await this.timelineRepository.save(timeline);
  }

  /**
   * 查询项目时间线事件
   */
  async findAll(queryDto: QueryTimelineDto): Promise<{
    items: ProjectTimeline[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { projectId, startDate, endDate, page = 1, limit = 10 } = queryDto;

    const queryBuilder = this.timelineRepository
      .createQueryBuilder('timeline')
      .leftJoinAndSelect('timeline.project', 'project');

    // 按项目筛选
    if (projectId) {
      queryBuilder.andWhere('project.id = :projectId', { projectId });
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('timeline.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('timeline.date >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('timeline.date <= :endDate', { endDate });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页和排序
    queryBuilder
      .orderBy('timeline.date', 'DESC')
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
   * 获取指定项目的时间线
   */
  async findByProjectId(projectId: string): Promise<ProjectTimeline[]> {
    const timeline = await this.timelineRepository.find({
      where: { project: { id: projectId } },
      order: { date: 'ASC' },
    });

    return timeline;
  }

  /**
   * 根据ID查找时间线记录
   */
  async findOne(id: string) {
    const timeline = await this.timelineRepository.findOne({
      where: { id },
      relations: ['project', 'operator'],
    });

    if (!timeline) {
      throw new NotFoundException(`未找到ID为${id}的时间线记录`);
    }

    return timeline;
  }

  /**
   * 更新时间线记录
   */
  async update(id: string, updateProjectTimelineDto: UpdateTimelineDto) {
    // 先检查记录是否存在
    await this.findOne(id);

    await this.timelineRepository.update(id, updateProjectTimelineDto);
    return await this.findOne(id);
  }

  /**
   * 删除时间线记录
   */
  async remove(id: string) {
    // 先检查记录是否存在
    await this.findOne(id);

    await this.timelineRepository.delete(id);
  }
}
