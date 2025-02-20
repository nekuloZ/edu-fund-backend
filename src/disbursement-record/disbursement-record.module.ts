import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisbursementRecord } from './entities/disbursement-record.entity';
import { DisbursementRecordService } from './disbursement-record.service';
import { DisbursementRecordController } from './disbursement-record.controller';

@Module({
  imports: [
    // 注册 DisbursementRecord 实体，便于 TypeORM 注入使用
    TypeOrmModule.forFeature([DisbursementRecord]),
  ],
  controllers: [DisbursementRecordController],
  providers: [DisbursementRecordService],
  exports: [DisbursementRecordService],
})
export class DisbursementRecordModule {}
