// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DonationModule } from '../donation/donation.module';
import { ProjectModule } from '../project/project.module';
import { FundPoolModule } from '../fund-pool/fund-pool.module';
import { StudentModule } from '../student/student.module';
import { Donation } from '../donation/entities/donation.entity';
import { Project } from '../project/entities/project.entity';
import { FundPool } from '../fund-pool/entities/fund-pool.entity';
import { Student } from '../student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation, Project, FundPool, Student]),
    DonationModule,
    ProjectModule,
    FundPoolModule,
    StudentModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
