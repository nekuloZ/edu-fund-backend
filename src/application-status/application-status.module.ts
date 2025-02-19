import { Module } from '@nestjs/common';
import { ApplicationStatusService } from './application-status.service';
import { ApplicationStatusController } from './application-status.controller';

@Module({
  controllers: [ApplicationStatusController],
  providers: [ApplicationStatusService],
})
export class ApplicationStatusModule {}
