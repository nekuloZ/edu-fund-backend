import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApplicationAttachmentService } from './application-attachment.service';
import { CreateApplicationAttachmentDto } from './dto/create-application-attachment.dto';
import { UpdateApplicationAttachmentDto } from './dto/update-application-attachment.dto';
import { QueryApplicationAttachmentDto } from './dto/query-application-attachment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/application-attachments')
@UseGuards(JwtAuthGuard) // 保护所有接口，确保只有经过认证的用户才能操作
export class ApplicationAttachmentController {
  constructor(
    private readonly attachmentService: ApplicationAttachmentService,
  ) {}

  /**
   * 附件上传
   * POST /api/application-attachments
   * 根据请求体中的数据创建新的附件记录，并与项目申请关联
   */
  @Post()
  async createAttachment(@Body() createDto: CreateApplicationAttachmentDto) {
    return await this.attachmentService.createAttachment(createDto);
  }

  /**
   * 附件更新
   * PUT /api/application-attachments/:id
   * 根据附件ID更新附件信息（如文件路径或类型）
   */
  @Put(':id')
  async updateAttachment(
    @Param('id') id: number,
    @Body() updateDto: UpdateApplicationAttachmentDto,
  ) {
    return await this.attachmentService.updateAttachment(id, updateDto);
  }

  /**
   * 附件查询
   * GET /api/application-attachments
   * 根据项目申请ID查询所有相关附件记录，支持分页查询
   */
  @Get()
  async queryAttachments(@Query() queryDto: QueryApplicationAttachmentDto) {
    return await this.attachmentService.findAttachmentsByApplicationId(
      queryDto,
    );
  }

  /**
   * 附件删除
   * DELETE /api/application-attachments/:id
   * 根据附件ID删除附件记录，同时可在业务层处理文件服务器上的文件清理
   */
  @Delete(':id')
  async deleteAttachment(@Param('id') id: number) {
    await this.attachmentService.deleteAttachment(id);
    return { message: '附件删除成功' };
  }
}
