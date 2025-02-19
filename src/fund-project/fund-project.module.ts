import { Module } from '@nestjs/common';
import { FundProjectService } from './fund-project.service';
import { FundProjectController } from './fund-project.controller';

@Module({
  controllers: [FundProjectController],
  providers: [FundProjectService],
})
export class FundProjectModule {}
