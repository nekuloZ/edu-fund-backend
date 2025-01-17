import { Module } from '@nestjs/common';
import { ApplicationReviewsService } from './application-reviews.service';
import { ApplicationReviewsController } from './application-reviews.controller';

@Module({
  controllers: [ApplicationReviewsController],
  providers: [ApplicationReviewsService],
})
export class ApplicationReviewsModule {}
