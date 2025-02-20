import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationStatusController } from './application-status.controller';
import { ApplicationStatusService } from './application-status.service';
import { ApplicationStatus } from './entities/application-status.entity';
import { FundApplication } from '../fund-application/entities/fund-application.entity';

@Module({
  imports: [
    // 注册 ApplicationStatus 与 FundApplication 实体，用于 Service 中的依赖注入及关联校验
    TypeOrmModule.forFeature([ApplicationStatus, FundApplication]),
  ],
  controllers: [ApplicationStatusController],
  providers: [ApplicationStatusService],
  exports: [ApplicationStatusService],
})
export class ApplicationStatusModule {}
