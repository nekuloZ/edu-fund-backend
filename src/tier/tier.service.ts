import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';
import { QueryTierDto } from './dto/query-tier.dto';
import { Tier } from './entities/tier.entity';
// 如果存在奖学金申请的实体，需要对其进行引用，用于删除前的完整性校验
// import { ScholarshipApplication } from '../scholarship-application/entities/scholarship-application.entity';

@Injectable()
export class TierService {
  constructor(
    @InjectRepository(Tier)
    private readonly tierRepository: Repository<Tier>,
    // 如果有需要进行关联校验的实体，则注入对应的仓库
    // @InjectRepository(ScholarshipApplication)
    // private readonly scholarshipApplicationRepository: Repository<ScholarshipApplication>,
    private readonly connection: Connection,
  ) {}

  /**
   * 创建档次
   * 根据 CreateTierDto 创建新的奖学金档次记录，并写入数据库
   */
  async create(createDto: CreateTierDto): Promise<Tier> {
    const tier = this.tierRepository.create(createDto);
    return await this.tierRepository.save(tier);
  }

  /**
   * 查询档次列表
   * 支持关键字搜索、排序和分页，返回匹配的档次记录及总记录数
   */
  async findAll(
    queryDto: QueryTierDto,
  ): Promise<{ data: Tier[]; total: number }> {
    const {
      keyword,
      page = 1,
      limit = 10,
      sortBy = 'tierName',
      order = 'ASC',
    } = queryDto;
    const query = this.tierRepository.createQueryBuilder('tier');

    if (keyword) {
      query.where(
        'tier.tierName LIKE :keyword OR tier.conditions LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    query.orderBy(`tier.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 查询档次详情
   * 根据档次 ID 获取单个档次的详细信息
   */
  async findOne(id: number): Promise<Tier> {
    const tier = await this.tierRepository.findOne({ where: { tier_id: id } });
    if (!tier) {
      throw new NotFoundException(`Tier with id ${id} not found`);
    }
    return tier;
  }

  /**
   * 更新档次
   * 根据 UpdateTierDto 修改已有档次的信息，更新前进行数据校验
   */
  async update(id: number, updateDto: UpdateTierDto): Promise<Tier> {
    const tier = await this.findOne(id);
    Object.assign(tier, updateDto);
    return await this.tierRepository.save(tier);
  }

  /**
   * 删除档次
   * 在删除前校验是否存在关联的业务数据（例如奖学金申请）引用该档次，防止数据不一致
   */
  async remove(id: number): Promise<void> {
    // 如果有相关的业务数据（例如 ScholarshipApplication），则先进行校验：
    // const count = await this.scholarshipApplicationRepository.count({
    //   where: { tier: { tier_id: id } },
    // });
    // if (count > 0) {
    //   throw new BadRequestException(
    //     `Cannot delete tier with id ${id} because it is referenced by ${count} scholarship application(s).`,
    //   );
    // }
    await this.tierRepository.delete(id);
  }
}
