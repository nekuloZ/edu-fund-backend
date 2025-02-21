import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // POST /api/notifications
  // 创建新的系统通知
  @Post()
  async create(@Body() createDto: CreateNotificationDto) {
    return await this.notificationService.create(createDto);
  }

  // PUT /api/notifications/:id
  // 更新通知状态或内容
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateNotificationDto,
  ) {
    return await this.notificationService.update(id, updateDto);
  }

  // GET /api/notifications
  // 查询通知列表，支持多条件筛选、排序和分页
  @Get()
  async findAll(@Query() queryDto: QueryNotificationDto) {
    return await this.notificationService.findAll(queryDto);
  }

  // GET /api/notifications/:id
  // 根据通知ID获取通知详情
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.notificationService.findOne(id);
  }

  // DELETE /api/notifications/:id
  // 删除通知记录
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.notificationService.remove(id);
  }
}
