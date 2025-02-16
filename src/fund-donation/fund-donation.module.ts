import { Module } from '@nestjs/common';
import { FundDonationService } from './fund-donation.service';
import { FundDonationController } from './fund-donation.controller';

@Module({
  controllers: [FundDonationController],
  providers: [FundDonationService],
})
export class FundDonationModule {}
