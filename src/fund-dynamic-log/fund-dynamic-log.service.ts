import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateFundDynamicLogDto } from './dto/create-fund-dynamic-log.dto';
import { UpdateFundDynamicLogDto } from './dto/update-fund-dynamic-log.dto';
import { QueryFundDynamicLogDto } from './dto/query-fund-dynamic-log.dto';
import { FundDynamicLog } from './entities/fund-dynamic-log.entity';

@Injectable()
export class FundDynamicLogService {
  constructor(
    @InjectRepository(FundDynamicLog)
    private readonly dynamicLogRepository: Repository<FundDynamicLog>,
    private readonly connection: Connection,
  ) {}

  /**
   * 创建资金动态日志
   * 当资金变动事件发生时调用此方法创建日志记录，校验金额大于零，
   * 并自动记录日志信息（如交易日期默认为当前时间）。
   */
  async create(createDto: CreateFundDynamicLogDto): Promise<FundDynamicLog> {
    if (createDto.amount <= 0) {
      throw new BadRequestException('资金变动金额必须大于零');
    }
    // 创建日志实体，若 createDto.transactionDate 未传，则可在实体中设置默认值
    const log = this.dynamicLogRepository.create(createDto);
    return await this.dynamicLogRepository.save(log);
  }

  /**
   * 更新资金动态日志
   * 根据传入的日志ID和更新数据更新日志记录，支持部分字段更新，
   * 并对资金金额做基本校验。
   */
  async update(
    id: number,
    updateDto: UpdateFundDynamicLogDto,
  ): Promise<FundDynamicLog> {
    const log = await this.dynamicLogRepository.findOne({
      where: { log_id: id },
    });
    if (!log) {
      throw new NotFoundException(`资金动态日志 id ${id} 不存在`);
    }
    if (updateDto.amount !== undefined && updateDto.amount <= 0) {
      throw new BadRequestException('资金变动金额必须大于零');
    }
    Object.assign(log, updateDto);
    return await this.dynamicLogRepository.save(log);
  }

  /**
   * 查询资金动态日志列表
   * 支持根据日志类型、资金来源、资金去向及交易日期范围进行筛选，同时支持分页和排序。
   */
  async findAll(
    queryDto: QueryFundDynamicLogDto,
  ): Promise<{ data: FundDynamicLog[]; total: number }> {
    const {
      logType,
      fundSource,
      fundDestination,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'transactionDate',
      order = 'ASC',
    } = queryDto;
    const query = this.dynamicLogRepository.createQueryBuilder('log');

    if (logType) {
      query.andWhere('log.logType LIKE :logType', { logType: `%${logType}%` });
    }
    if (fundSource) {
      query.andWhere('log.fundSource LIKE :fundSource', {
        fundSource: `%${fundSource}%`,
      });
    }
    if (fundDestination) {
      query.andWhere('log.fundDestination LIKE :fundDestination', {
        fundDestination: `%${fundDestination}%`,
      });
    }
    if (startDate) {
      query.andWhere('log.transactionDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('log.transactionDate <= :endDate', { endDate });
    }

    query.orderBy(`log.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 查询资金动态日志详情
   * 根据日志ID返回单个日志的详细信息，便于对账和审计使用。
   */
  async findOne(id: number): Promise<FundDynamicLog> {
    const log = await this.dynamicLogRepository.findOne({
      where: { log_id: id },
    });
    if (!log) {
      throw new NotFoundException(`资金动态日志 id ${id} 不存在`);
    }
    return log;
  }

  /**
   * 删除资金动态日志
   * 根据日志ID删除日志记录；删除前可根据业务规则添加关联校验逻辑，
   * 例如防止删除不可篡改的审计记录（此处提供直接删除实现）。
   */
  async remove(id: number): Promise<void> {
    const log = await this.dynamicLogRepository.findOne({
      where: { log_id: id },
    });
    if (!log) {
      throw new NotFoundException(`资金动态日志 id ${id} 不存在`);
    }
    await this.dynamicLogRepository.delete(id);
  }
}
