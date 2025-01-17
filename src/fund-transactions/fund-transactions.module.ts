import { Module } from '@nestjs/common';
import { FundTransactionsService } from './fund-transactions.service';
import { FundTransactionsController } from './fund-transactions.controller';

@Module({
  controllers: [FundTransactionsController],
  providers: [FundTransactionsService],
})
export class FundTransactionsModule {}
