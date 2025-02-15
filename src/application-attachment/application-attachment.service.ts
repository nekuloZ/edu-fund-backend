import { Injectable } from '@nestjs/common';
import { CreateApplicationAttachmentDto } from './dto/create-application-attachment.dto';
import { UpdateApplicationAttachmentDto } from './dto/update-application-attachment.dto';

@Injectable()
export class ApplicationAttachmentService {
  create(createApplicationAttachmentDto: CreateApplicationAttachmentDto) {
    return 'This action adds a new applicationAttachment';
  }

  findAll() {
    return `This action returns all applicationAttachment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicationAttachment`;
  }

  update(id: number, updateApplicationAttachmentDto: UpdateApplicationAttachmentDto) {
    return `This action updates a #${id} applicationAttachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicationAttachment`;
  }
}
