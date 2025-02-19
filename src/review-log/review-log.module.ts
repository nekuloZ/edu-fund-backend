import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewLog } from './entities/review-log.entity';
import { FundApplication } from '../fund-application/entities/fund-application.entity';
import { ReviewLogService } from './review-log.service';
import { ReviewLogController } from './review-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewLog, FundApplication])],
  controllers: [ReviewLogController],
  providers: [ReviewLogService],
  exports: [ReviewLogService],
})
export class ReviewLogModule {}
