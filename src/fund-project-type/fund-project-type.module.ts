import { Module } from '@nestjs/common';
import { FundProjectTypeService } from './fund-project-type.service';
import { FundProjectTypeController } from './fund-project-type.controller';

@Module({
  controllers: [FundProjectTypeController],
  providers: [FundProjectTypeService],
})
export class FundProjectTypeModule {}
