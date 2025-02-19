import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationAttachment } from './entities/application-attachment.entity';
import { CreateApplicationAttachmentDto } from './dto/create-application-attachment.dto';
import { UpdateApplicationAttachmentDto } from './dto/update-application-attachment.dto';
import { QueryApplicationAttachmentDto } from './dto/query-application-attachment.dto';

@Injectable()
export class ApplicationAttachmentService {
  constructor(
    @InjectRepository(ApplicationAttachment)
    private readonly attachmentRepository: Repository<ApplicationAttachment>,
  ) {}

  /**
   * 附件上传
   * 创建新的附件记录，并将附件与对应的项目申请关联存储
   */
  async createAttachment(
    dto: CreateApplicationAttachmentDto,
  ): Promise<ApplicationAttachment> {
    // 创建附件实体实例
    const attachment = this.attachmentRepository.create(dto);
    // 保存到数据库中
    return await this.attachmentRepository.save(attachment);
  }

  /**
   * 附件更新
   * 根据附件ID更新附件记录，例如更新文件路径或文件类型
   */
  async updateAttachment(
    id: number,
    dto: UpdateApplicationAttachmentDto,
  ): Promise<ApplicationAttachment> {
    const attachment = await this.attachmentRepository.findOneBy({
      attachment_id: id,
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    // 合并更新数据
    Object.assign(attachment, dto);
    return await this.attachmentRepository.save(attachment);
  }

  /**
   * 附件查询
   * 根据项目申请ID查询所有相关的附件记录，支持分页查询
   */
  async findAttachmentsByApplicationId(
    queryDto: QueryApplicationAttachmentDto,
  ): Promise<{ data: ApplicationAttachment[]; total: number }> {
    const { application_id, page = 1, limit = 10 } = queryDto;
    // 使用 findAndCount 实现分页查询
    const [data, total] = await this.attachmentRepository.findAndCount({
      where: { application: { application_id } }, // 假设实体中配置了 application 关联关系
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  /**
   * 附件删除
   * 根据附件ID删除附件记录，同时确保数据一致性（必要时同步删除文件服务器上的文件）
   */
  async deleteAttachment(id: number): Promise<void> {
    const attachment = await this.attachmentRepository.findOneBy({
      attachment_id: id,
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    await this.attachmentRepository.remove(attachment);
  }
}
