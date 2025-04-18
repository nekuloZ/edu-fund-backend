// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../donation/entities/donation.entity';
import { Project } from '../project/entities/project.entity';
import { FundPool } from '../fund-pool/entities/fund-pool.entity';
import { Student } from '../student/entities/student.entity';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Donation)
    private donationRepo: Repository<Donation>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(FundPool)
    private fundPoolRepo: Repository<FundPool>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const [donationStats, projectStats, fundStats, studentStats] =
      await Promise.all([
        this.getDonationStats(),
        this.getProjectStats(),
        this.getFundStats(),
        this.getStudentStats(),
      ]);

    return {
      donation: donationStats,
      project: projectStats,
      fund: fundStats,
      student: studentStats,
    };
  }

  private async getDonationStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalAmount, monthlyAmount, totalCount, monthlyCount] =
      await Promise.all([
        this.donationRepo.sum('amount'),
        this.donationRepo
          .createQueryBuilder('d')
          .where('d.createdAt >= :startOfMonth', { startOfMonth })
          .select('SUM(d.amount)', 'sum')
          .getRawOne(),
        this.donationRepo.count(),
        this.donationRepo
          .createQueryBuilder('d')
          .where('d.createdAt >= :startOfMonth', { startOfMonth })
          .getCount(),
      ]);

    return {
      totalAmount,
      monthlyAmount: monthlyAmount?.sum || 0,
      totalCount,
      monthlyCount,
    };
  }

  private async getProjectStats() {
    const [activeCount, completedCount, pendingCount] = await Promise.all([
      this.projectRepo.count({ where: { status: 'active' } }),
      this.projectRepo.count({ where: { status: 'completed' } }),
      this.projectRepo.count({ where: { status: 'pending' } }),
    ]);

    return {
      activeCount,
      completedCount,
      pendingCount,
    };
  }

  private async getFundStats() {
    const fundPool = await this.fundPoolRepo.findOne({});
    const allocatedAmount = await this.fundPoolRepo
      .createQueryBuilder('fp')
      .leftJoinAndSelect('fp.allocations', 'a')
      .select('SUM(a.amount)', 'sum')
      .getRawOne();

    return {
      totalBalance: fundPool?.totalBalance || 0,
      allocatedAmount: allocatedAmount?.sum || 0,
      availableAmount:
        (fundPool?.availableBalance || 0) - (allocatedAmount?.sum || 0),
    };
  }

  private async getStudentStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalCount, aidedCount, monthlyNewCount] = await Promise.all([
      this.studentRepo.count(),
      this.studentRepo
        .createQueryBuilder('s')
        .leftJoin('s.aidRecords', 'ar')
        .where('ar.id IS NOT NULL')
        .getCount(),
      this.studentRepo
        .createQueryBuilder('s')
        .where('s.createdAt >= :startOfMonth', { startOfMonth })
        .getCount(),
    ]);

    return {
      totalCount,
      aidedCount,
      monthlyNewCount,
    };
  }
}
