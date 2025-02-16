import { Module } from '@nestjs/common';
import { FundDynamicLogService } from './fund-dynamic-log.service';
import { FundDynamicLogController } from './fund-dynamic-log.controller';

@Module({
  controllers: [FundDynamicLogController],
  providers: [FundDynamicLogService],
})
export class FundDynamicLogModule {}
