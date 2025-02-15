import { Module } from '@nestjs/common';
import { ApplicationAttachmentService } from './application-attachment.service';
import { ApplicationAttachmentController } from './application-attachment.controller';

@Module({
  controllers: [ApplicationAttachmentController],
  providers: [ApplicationAttachmentService],
})
export class ApplicationAttachmentModule {}
