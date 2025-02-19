import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationAttachment } from './entities/application-attachment.entity';
import { ApplicationAttachmentService } from './application-attachment.service';
import { ApplicationAttachmentController } from './application-attachment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationAttachment])],
  providers: [ApplicationAttachmentService],
  controllers: [ApplicationAttachmentController],
  exports: [ApplicationAttachmentService],
})
export class ApplicationAttachmentModule {}
