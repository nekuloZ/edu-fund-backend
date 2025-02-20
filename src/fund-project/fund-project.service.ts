import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFundProjectDto } from './dto/create-fund-project.dto';
import { UpdateFundProjectDto } from './dto/update-fund-project.dto';
import { QueryFundProjectDto } from './dto/query-fund-project.dto';
import { FundProject } from './entities/fund-project.entity';
import { FundApplication } from '../fund-application/entities/fund-application.entity';

@Injectable()
export class FundProjectService {
  constructor(
    @InjectRepository(FundProject)
    private readonly fundProjectRepository: Repository<FundProject>,
    @InjectRepository(FundApplication)
    private readonly fundApplicationRepository: Repository<FundApplication>,
    private readonly connection: Connection,
  ) {}

  /**
   * 项目创建与维护
   * 创建新的基金项目，录入项目名称、负责人、项目周期、预算、进度、描述等信息，
   * 对输入数据进行校验后写入 FundProject 表中。
   */
  async create(createDto: CreateFundProjectDto): Promise<FundProject> {
    const project = this.fundProjectRepository.create(createDto);
    return await this.fundProjectRepository.save(project);
  }

  /**
   * 项目查询与展示
   * 提供统一的查询接口，支持关键字搜索、排序和分页，
   * 方便用户快速定位和浏览项目列表。
   */
  async findAll(
    queryDto: QueryFundProjectDto,
  ): Promise<{ data: FundProject[]; total: number }> {
    const {
      keyword,
      page = 1,
      limit = 10,
      sortBy = 'projectName',
      order = 'ASC',
    } = queryDto;
    const query = this.fundProjectRepository.createQueryBuilder('project');

    if (keyword) {
      query.where(
        'project.projectName LIKE :keyword OR project.projectLeader LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    query.orderBy(`project.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 项目查询详情
   * 根据项目 ID 获取项目的详细信息，便于业务人员和其他模块调用。
   */
  async findOne(id: number): Promise<FundProject> {
    const project = await this.fundProjectRepository.findOne({
      where: { project_id: id },
    });
    if (!project) {
      throw new NotFoundException(`Fund project with id ${id} not found`);
    }
    return project;
  }

  /**
   * 项目更新
   * 提供接口允许对已有项目进行修改，如更新进度、调整预算、修改描述等。
   * 更新前进行数据校验，确保修改后的数据符合业务要求和格式标准。
   */
  async update(
    id: number,
    updateDto: UpdateFundProjectDto,
  ): Promise<FundProject> {
    const project = await this.findOne(id);
    Object.assign(project, updateDto);
    return await this.fundProjectRepository.save(project);
  }

  /**
   * 项目删除
   * 提供删除项目记录的接口，删除前校验是否存在关联的基金项目申请，
   * 防止因删除导致数据不一致；必要时采用级联删除或限制删除策略。
   */
  async remove(id: number): Promise<void> {
    // 检查是否有基金项目申请引用该项目
    const count = await this.fundApplicationRepository.count({
      where: { project_id: id },
    });
    if (count > 0) {
      throw new BadRequestException(
        `Cannot delete fund project with id ${id} because it is referenced by ${count} application(s).`,
      );
    }
    await this.fundProjectRepository.delete(id);
  }
}
