import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundInstitution } from './entities/fund-institution.entity';
import { FundInstitutionController } from './fund-institution.controller';
import { FundInstitutionService } from './fund-institution.service';

@Module({
  imports: [TypeOrmModule.forFeature([FundInstitution])],
  controllers: [FundInstitutionController],
  providers: [FundInstitutionService],
})
export class FundInstitutionModule {}
