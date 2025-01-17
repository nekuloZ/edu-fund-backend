import { Module } from '@nestjs/common';
import { ProjectFundsService } from './project-funds.service';
import { ProjectFundsController } from './project-funds.controller';

@Module({
  controllers: [ProjectFundsController],
  providers: [ProjectFundsService],
})
export class ProjectFundsModule {}
