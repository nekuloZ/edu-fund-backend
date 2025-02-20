import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationStatusDto } from './dto/create-application-status.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { QueryApplicationStatusDto } from './dto/query-application-status.dto';
import { ApplicationStatus } from './entities/application-status.entity';
import { FundApplication } from '../fund-application/entities/fund-application.entity';

@Injectable()
export class ApplicationStatusService {
  constructor(
    @InjectRepository(ApplicationStatus)
    private readonly statusRepository: Repository<ApplicationStatus>,
    @InjectRepository(FundApplication)
    private readonly fundApplicationRepository: Repository<FundApplication>,
  ) {}

  /**
   * 创建申请状态
   * 接收 CreateApplicationStatusDto，生成新的申请状态记录
   */
  async create(
    createDto: CreateApplicationStatusDto,
  ): Promise<ApplicationStatus> {
    const status = this.statusRepository.create(createDto);
    return await this.statusRepository.save(status);
  }

  /**
   * 查询申请状态列表
   * 支持关键字搜索（状态名称和描述）及分页查询
   */
  async findAll(
    queryDto: QueryApplicationStatusDto,
  ): Promise<{ data: ApplicationStatus[]; total: number }> {
    const { keyword, page = 1, limit = 10 } = queryDto;
    const query = this.statusRepository.createQueryBuilder('status');
    if (keyword) {
      query.where(
        'status.statusName LIKE :keyword OR status.description LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 查询申请状态详情
   * 根据状态 ID 返回申请状态的详细信息
   */
  async findOne(id: number): Promise<ApplicationStatus> {
    const status = await this.statusRepository.findOne({
      where: { status_id: id },
    });
    if (!status) {
      throw new NotFoundException(`Application status with id ${id} not found`);
    }
    return status;
  }

  /**
   * 更新申请状态
   * 允许修改状态名称和描述，确保状态定义与业务需求保持一致
   */
  async update(
    id: number,
    updateDto: UpdateApplicationStatusDto,
  ): Promise<ApplicationStatus> {
    const status = await this.findOne(id);
    Object.assign(status, updateDto);
    return await this.statusRepository.save(status);
  }

  /**
   * 删除申请状态
   * 删除前需校验是否有基金项目申请关联该状态，防止数据不一致
   */
  async remove(id: number): Promise<void> {
    // 检查是否存在关联的基金项目申请（假设 FundApplication.status 存储的是 ApplicationStatus 的 id）
    const count = await this.fundApplicationRepository.count({
      where: { status_id: id },
    });
    if (count > 0) {
      throw new BadRequestException(
        `Cannot delete status with id ${id} because it is associated with existing applications`,
      );
    }
    await this.statusRepository.delete(id);
  }
}
