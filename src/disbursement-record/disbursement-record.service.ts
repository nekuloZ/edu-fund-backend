import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateDisbursementRecordDto } from './dto/create-disbursement-record.dto';
import { UpdateDisbursementRecordDto } from './dto/update-disbursement-record.dto';
import { QueryDisbursementRecordDto } from './dto/query-disbursement-record.dto';
import { DisbursementRecord } from './entities/disbursement-record.entity';

@Injectable()
export class DisbursementRecordService {
  constructor(
    @InjectRepository(DisbursementRecord)
    private readonly disbursementRecordRepository: Repository<DisbursementRecord>,
    private readonly connection: Connection,
  ) {}

  /**
   * 创建拨款记录
   * 当项目申请审核通过且财务确认拨款时，调用该方法创建拨款记录。
   * 需校验拨款金额大于零，并可选传入拨款时间（否则后端默认当前时间）。
   */
  async create(
    createDto: CreateDisbursementRecordDto,
  ): Promise<DisbursementRecord> {
    if (createDto.disbursementAmount <= 0) {
      throw new BadRequestException('拨款金额必须大于零');
    }
    // 这里可以在事务中处理其他关联操作
    const record = this.disbursementRecordRepository.create(createDto);
    return await this.disbursementRecordRepository.save(record);
  }

  /**
   * 更新拨款记录
   * 允许修改拨款金额、拨款时间、操作员、状态及备注等字段，更新前进行数据校验。
   */
  async update(
    id: number,
    updateDto: UpdateDisbursementRecordDto,
  ): Promise<DisbursementRecord> {
    const record = await this.disbursementRecordRepository.findOne({
      where: { record_id: id },
    });
    if (!record) {
      throw new NotFoundException(`拨款记录 id ${id} 不存在`);
    }
    if (
      updateDto.disbursementAmount !== undefined &&
      updateDto.disbursementAmount <= 0
    ) {
      throw new BadRequestException('拨款金额必须大于零');
    }
    Object.assign(record, updateDto);
    return await this.disbursementRecordRepository.save(record);
  }

  /**
   * 查询拨款记录列表
   * 支持根据申请ID、操作员、状态、日期范围进行筛选，并支持关键字搜索、分页和排序。
   */
  async findAll(
    queryDto: QueryDisbursementRecordDto,
  ): Promise<{ data: DisbursementRecord[]; total: number }> {
    const {
      applicationId,
      operatorId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'disbursementDate',
      order = 'ASC',
    } = queryDto;

    const query =
      this.disbursementRecordRepository.createQueryBuilder('record');

    if (applicationId) {
      query.andWhere('record.applicationId = :applicationId', {
        applicationId,
      });
    }
    if (operatorId) {
      query.andWhere('record.operatorId = :operatorId', { operatorId });
    }
    if (status) {
      query.andWhere('record.status = :status', { status });
    }
    if (startDate) {
      query.andWhere('record.disbursementDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('record.disbursementDate <= :endDate', { endDate });
    }

    query.orderBy(`record.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 查询拨款记录详情
   * 根据拨款记录ID返回详细信息，便于审核和对账。
   */
  async findOne(id: number): Promise<DisbursementRecord> {
    const record = await this.disbursementRecordRepository.findOne({
      where: { record_id: id },
    });
    if (!record) {
      throw new NotFoundException(`拨款记录 id ${id} 不存在`);
    }
    return record;
  }

  /**
   * 删除拨款记录
   * 根据业务规则（例如财务凭证的处理要求）决定是否允许删除，
   * 这里提供直接删除的实现，删除前可增加关联校验逻辑。
   */
  async remove(id: number): Promise<void> {
    const record = await this.disbursementRecordRepository.findOne({
      where: { record_id: id },
    });
    if (!record) {
      throw new NotFoundException(`拨款记录 id ${id} 不存在`);
    }
    // 如有需要，可在此处添加关联数据校验（例如是否已生成资金流水）
    await this.disbursementRecordRepository.delete(id);
  }
}
