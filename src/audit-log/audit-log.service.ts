import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../user/entities/user.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 创建审计日志
   */
  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const { userId, ...logData } = createAuditLogDto;

    // 创建审计日志实例
    const auditLog = this.auditLogRepository.create(logData);

    // 如果提供了用户ID，则关联用户
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        auditLog.user = user;
      }
    }

    // 保存审计日志
    return await this.auditLogRepository.save(auditLog);
  }

  /**
   * 获取审计日志列表
   */
  async findAll(queryDto: QueryAuditLogDto): Promise<{
    items: AuditLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      action,
      entity,
      entityId,
      userId,
      keyword,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    // 构建查询条件
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user');

    // 按操作类型筛选
    if (action) {
      queryBuilder.andWhere('auditLog.action = :action', { action });
    }

    // 按实体类型筛选
    if (entity) {
      queryBuilder.andWhere('auditLog.entity = :entity', { entity });
    }

    // 按实体ID筛选
    if (entityId) {
      queryBuilder.andWhere('auditLog.entityId = :entityId', { entityId });
    }

    // 按用户ID筛选
    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(auditLog.action LIKE :keyword OR auditLog.entity LIKE :keyword OR auditLog.entityId LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'auditLog.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('auditLog.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('auditLog.createdAt <= :endDate', { endDate });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 排序和分页
    queryBuilder
      .orderBy(`auditLog.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // 获取结果
    const items = await queryBuilder.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取特定审计日志
   */
  async findOne(id: number): Promise<AuditLog> {
    return await this.auditLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  /**
   * 清理过期审计日志（可选，用于维护）
   */
  async cleanupLogs(beforeDate: Date): Promise<void> {
    await this.auditLogRepository.delete({
      createdAt: Between(new Date(0), beforeDate),
    });
  }

  /**
   * 获取最近的操作日志
   */
  async getRecentLogs(limit: number = 10): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * 获取用户操作日志
   */
  async getUserLogs(userId: string): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 获取实体操作日志
   */
  async getEntityLogs(entity: string, entityId: string): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { entity, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 记录数据库操作
   */
  async logDatabaseOperation(
    action: string,
    entity: string,
    entityId: string,
    oldValues: object,
    newValues: object,
    userId?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return await this.create({
      action,
      entity,
      entityId,
      oldValues,
      newValues,
      userId,
      ip,
      userAgent,
    });
  }
}
