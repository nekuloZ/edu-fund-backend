import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFundProjectTypeDto } from './dto/create-fund-project-type.dto';
import { UpdateFundProjectTypeDto } from './dto/update-fund-project-type.dto';
import { QueryFundProjectTypeDto } from './dto/query-fund-project-type.dto';
import { FundProjectType } from './entities/fund-project-type.entity';
// 引入 FundProject 实体，用于删除前关联校验
import { FundProject } from '../fund-project/entities/fund-project.entity';

@Injectable()
export class FundProjectTypeService {
  constructor(
    @InjectRepository(FundProjectType)
    private readonly projectTypeRepository: Repository<FundProjectType>,
    @InjectRepository(FundProject)
    private readonly projectRepository: Repository<FundProject>,
  ) {}

  /**
   * 创建项目类型
   * 根据传入的 CreateFundProjectTypeDto 创建新的项目类型记录
   */
  async create(createDto: CreateFundProjectTypeDto): Promise<FundProjectType> {
    const projectType = this.projectTypeRepository.create(createDto);
    return await this.projectTypeRepository.save(projectType);
  }

  /**
   * 查询项目类型列表
   * 支持关键字搜索、排序和分页查询
   */
  async findAll(
    queryDto: QueryFundProjectTypeDto,
  ): Promise<{ data: FundProjectType[]; total: number }> {
    const {
      keyword,
      page = 1,
      limit = 10,
      sortBy = 'projectTypeName',
      order = 'ASC',
    } = queryDto;
    const query = this.projectTypeRepository.createQueryBuilder('projectType');

    if (keyword) {
      query.where(
        'projectType.projectTypeName LIKE :keyword OR projectType.description LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    query.orderBy(
      `projectType.${sortBy}`,
      order.toUpperCase() as 'ASC' | 'DESC',
    );
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 查询项目类型详情
   * 根据项目类型 ID 返回单个项目类型的详细信息
   */
  async findOne(id: number): Promise<FundProjectType> {
    const projectType = await this.projectTypeRepository.findOne({
      where: { project_type_id: id },
    });
    if (!projectType) {
      throw new NotFoundException(`Fund project type with id ${id} not found`);
    }
    return projectType;
  }

  /**
   * 更新项目类型
   * 根据 UpdateFundProjectTypeDto 修改项目类型的名称或描述
   */
  async update(
    id: number,
    updateDto: UpdateFundProjectTypeDto,
  ): Promise<FundProjectType> {
    const projectType = await this.findOne(id);
    Object.assign(projectType, updateDto);
    return await this.projectTypeRepository.save(projectType);
  }

  /**
   * 删除项目类型
   * 删除前校验是否有基金项目引用该项目类型，防止因删除关联数据导致数据不一致
   */
  async remove(id: number): Promise<void> {
    // 检查是否存在关联的基金项目（FundProject 的 project_type_id 字段引用了 FundProjectType）
    const count = await this.projectRepository.count({
      where: { projectType: { project_type_id: id } },
    });
    if (count > 0) {
      throw new BadRequestException(
        `Cannot delete project type with id ${id} because it is associated with ${count} fund project(s).`,
      );
    }
    await this.projectTypeRepository.delete(id);
  }
}
