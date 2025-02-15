import { Module } from '@nestjs/common';
import { FundApplicationService } from './fund-application.service';
import { FundApplicationController } from './fund-application.controller';

@Module({
  controllers: [FundApplicationController],
  providers: [FundApplicationService],
})
export class FundApplicationModule {}
