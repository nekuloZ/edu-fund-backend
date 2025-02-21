import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * 创建系统通知
   * 当关键业务事件发生时调用此方法创建通知记录，要求数据符合格式校验。
   * 如果前端未传入创建时间，则由后端设置当前时间。
   */
  async create(createDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createDto,
      // 如果 createdAt 未传入，则默认当前时间
      created_at: createDto.createdAt
        ? new Date(createDto.createdAt)
        : new Date(),
    });
    return await this.notificationRepository.save(notification);
  }

  /**
   * 更新通知状态或其他字段
   * 允许用户标记通知为已读或修改通知内容，更新前需校验该通知是否存在。
   */
  async update(
    id: number,
    updateDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    Object.assign(notification, updateDto);
    return await this.notificationRepository.save(notification);
  }

  /**
   * 查询通知列表
   * 支持根据接收者ID、状态、通知类型、时间范围和关键字进行筛选，
   * 并支持分页和排序，方便用户快速定位相关通知。
   */
  async findAll(
    queryDto: QueryNotificationDto,
  ): Promise<{ data: Notification[]; total: number }> {
    const {
      recipientId,
      status,
      notificationType,
      startDate,
      endDate,
      keyword,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'ASC',
    } = queryDto;

    const query =
      this.notificationRepository.createQueryBuilder('notification');

    if (recipientId) {
      query.andWhere('notification.recipientId = :recipientId', {
        recipientId,
      });
    }
    if (status) {
      query.andWhere('notification.status = :status', { status });
    }
    if (notificationType) {
      query.andWhere('notification.notificationType = :notificationType', {
        notificationType,
      });
    }
    if (startDate) {
      query.andWhere('notification.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('notification.createdAt <= :endDate', { endDate });
    }
    if (keyword) {
      query.andWhere(
        'notification.title LIKE :keyword OR notification.message LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    query.orderBy(
      `notification.${sortBy}`,
      order.toUpperCase() as 'ASC' | 'DESC',
    );
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 获取通知详情
   * 根据通知ID返回单条通知的详细信息，便于用户确认通知内容。
   */
  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }

  /**
   * 删除通知
   * 根据通知ID删除通知记录，删除前可以增加权限和数据校验。
   */
  async remove(id: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    await this.notificationRepository.delete(id);
  }
}
