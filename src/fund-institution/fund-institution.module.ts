import { Module } from '@nestjs/common';
import { FundInstitutionService } from './fund-institution.service';
import { FundInstitutionController } from './fund-institution.controller';

@Module({
  controllers: [FundInstitutionController],
  providers: [FundInstitutionService],
})
export class FundInstitutionModule {}
