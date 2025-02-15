import { Module } from '@nestjs/common';
import { DisbursementRecordService } from './disbursement-record.service';
import { DisbursementRecordController } from './disbursement-record.controller';

@Module({
  controllers: [DisbursementRecordController],
  providers: [DisbursementRecordService],
})
export class DisbursementRecordModule {}
