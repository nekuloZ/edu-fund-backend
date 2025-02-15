import { Module } from '@nestjs/common';
import { ReviewLogService } from './review-log.service';
import { ReviewLogController } from './review-log.controller';

@Module({
  controllers: [ReviewLogController],
  providers: [ReviewLogService],
})
export class ReviewLogModule {}
