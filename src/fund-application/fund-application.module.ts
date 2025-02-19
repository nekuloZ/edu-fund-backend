import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundApplication } from './entities/fund-application.entity';
import { ApplicationAttachment } from '../application-attachment/entities/application-attachment.entity';
import { ReviewLog } from '../review-log/entities/review-log.entity';
import { FundApplicationService } from './fund-application.service';
import { FundApplicationController } from './fund-application.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FundApplication,
      ApplicationAttachment,
      ReviewLog,
    ]),
  ],
  providers: [FundApplicationService],
  controllers: [FundApplicationController],
  exports: [FundApplicationService],
})
export class FundApplicationModule {}
