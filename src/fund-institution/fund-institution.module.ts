import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundInstitution } from './entities/fund-institution.entity';
import { FundInstitutionService } from './fund-institution.service';
import { FundInstitutionController } from './fund-institution.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FundInstitution])],
  providers: [FundInstitutionService],
  controllers: [FundInstitutionController],
  exports: [FundInstitutionService],
})
export class FundInstitutionModule {}
