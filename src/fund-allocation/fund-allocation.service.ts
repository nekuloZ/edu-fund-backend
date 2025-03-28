import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundAllocation } from './entities/fund-allocation.entity';
import { Project, ProjectType } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { CreateFundAllocationDto } from './dto/create-fund-allocation.dto';
import {
  UpdateFundAllocationDto,
  FundAllocationStatus,
} from './dto/update-fund-allocation.dto';
import { QueryFundAllocationDto } from './dto/query-fund-allocation.dto';
import { ApprovalFundAllocationDto } from './dto/approval-fund-allocation.dto';
import { FundPoolService } from '../fund-pool/fund-pool.service';

@Injectable()
export class FundAllocationService {
  constructor(
    @InjectRepository(FundAllocation)
    private fundAllocationRepository: Repository<FundAllocation>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private fundPoolService: FundPoolService,
  ) {}

  /**
   * 创建资金分配记录
   */
  async create(
    createFundAllocationDto: CreateFundAllocationDto,
    operatorId: string,
  ): Promise<FundAllocation> {
    const { projectId, amount, description } = createFundAllocationDto;

    // 检查项目是否存在
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`ID为${projectId}的项目不存在`);
    }

    // 验证项目类型是否允许接收资金分配
    if (project.projectType === ProjectType.GENERAL_FUND) {
      throw new BadRequestException(`不能向公共池类型的项目直接分配资金`);
    }

    // 检查资金池是否有足够资金
    try {
      // 标记资金池中的待处理金额
      await this.fundPoolService.markPendingAmount(amount);
    } catch {
      throw new BadRequestException('资金池余额不足，无法创建资金分配记录');
    }

    // 获取操作员
    const operator = await this.userRepository.findOne({
      where: { id: operatorId },
    });

    // 创建资金分配记录
    const fundAllocation = this.fundAllocationRepository.create({
      project,
      amount,
      description,
      operator,
      date: new Date(),
      status: FundAllocationStatus.PENDING,
    });

    return await this.fundAllocationRepository.save(fundAllocation);
  }

  /**
   * 查询资金分配列表
   */
  async findAll(queryDto: QueryFundAllocationDto): Promise<{
    items: FundAllocation[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      projectId,
      status,
      keyword,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.fundAllocationRepository
      .createQueryBuilder('allocation')
      .leftJoinAndSelect('allocation.project', 'project')
      .leftJoinAndSelect('allocation.operator', 'operator')
      .leftJoinAndSelect('allocation.approver', 'approver');

    // 按项目筛选
    if (projectId) {
      queryBuilder.andWhere('project.id = :projectId', { projectId });
    }

    // 按状态筛选
    if (status) {
      queryBuilder.andWhere('allocation.status = :status', { status });
    }

    // 按关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(project.title LIKE :keyword OR allocation.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('allocation.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('allocation.date >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('allocation.date <= :endDate', { endDate });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder
      .orderBy('allocation.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const items = await queryBuilder.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 查询单个资金分配记录
   */
  async findOne(id: string): Promise<FundAllocation> {
    const fundAllocation = await this.fundAllocationRepository.findOne({
      where: { id },
      relations: ['project', 'operator', 'approver'],
    });

    if (!fundAllocation) {
      throw new NotFoundException(`ID为${id}的资金分配记录不存在`);
    }

    return fundAllocation;
  }

  /**
   * 更新资金分配记录
   */
  async update(
    id: string,
    updateFundAllocationDto: UpdateFundAllocationDto,
  ): Promise<FundAllocation> {
    const fundAllocation = await this.findOne(id);

    // 只有待审批状态下才能更新
    if (fundAllocation.status !== FundAllocationStatus.PENDING) {
      throw new ForbiddenException('只有待审批状态下的记录才能更新');
    }

    // 更新资金分配记录
    Object.assign(fundAllocation, updateFundAllocationDto);

    return await this.fundAllocationRepository.save(fundAllocation);
  }

  /**
   * 审批资金分配
   */
  async approve(
    id: string,
    approvalDto: ApprovalFundAllocationDto,
    approverId: string,
  ): Promise<FundAllocation> {
    const { status, comment } = approvalDto;
    const fundAllocation = await this.findOne(id);

    // 检查状态是否为待审批
    if (fundAllocation.status !== FundAllocationStatus.PENDING) {
      throw new BadRequestException('只能审批待审批状态的资金分配记录');
    }

    // 获取审批人
    const approver = await this.userRepository.findOne({
      where: { id: approverId },
    });

    if (!approver) {
      throw new NotFoundException(`ID为${approverId}的审批人不存在`);
    }

    // 更新审批信息
    fundAllocation.status = status;
    fundAllocation.approver = approver;
    fundAllocation.approvalDate = new Date();
    fundAllocation.approvalComment = comment;

    // 根据审批结果处理资金池
    if (status === FundAllocationStatus.APPROVED) {
      // 从资金池待处理资金转为已分配资金
      await this.fundPoolService.unmarkPendingAmount(fundAllocation.amount);
      await this.fundPoolService.allocateFunds(fundAllocation.amount);
    } else if (status === FundAllocationStatus.REJECTED) {
      // 返还待处理资金到可用余额
      await this.fundPoolService.unmarkPendingAmount(fundAllocation.amount);
    }

    return await this.fundAllocationRepository.save(fundAllocation);
  }

  /**
   * 标记资金分配为已完成
   */
  async markAsCompleted(id: string): Promise<FundAllocation> {
    const fundAllocation = await this.findOne(id);

    // 检查状态是否为已审批
    if (fundAllocation.status !== FundAllocationStatus.APPROVED) {
      throw new BadRequestException('只能将已审批的资金分配记录标记为已完成');
    }

    // 更新状态
    fundAllocation.status = FundAllocationStatus.COMPLETED;

    // 从资金池的已分配金额中移除
    await this.fundPoolService.deallocateFunds(fundAllocation.amount);

    return await this.fundAllocationRepository.save(fundAllocation);
  }

  /**
   * 取消资金分配申请
   */
  async cancel(id: string): Promise<FundAllocation> {
    const fundAllocation = await this.findOne(id);

    // 检查状态是否为待审批
    if (fundAllocation.status !== FundAllocationStatus.PENDING) {
      throw new BadRequestException('只能取消待审批状态的资金分配记录');
    }

    // 返还待处理资金到可用余额
    await this.fundPoolService.unmarkPendingAmount(fundAllocation.amount);

    // 标记为已拒绝
    fundAllocation.status = FundAllocationStatus.REJECTED;
    fundAllocation.approvalComment = '申请已取消';

    return await this.fundAllocationRepository.save(fundAllocation);
  }

  /**
   * 获取项目分配的资金总额
   */
  async getProjectAllocatedAmount(projectId: string): Promise<number> {
    const result = await this.fundAllocationRepository
      .createQueryBuilder('allocation')
      .select('SUM(allocation.amount)', 'totalAmount')
      .where('allocation.project.id = :projectId', { projectId })
      .andWhere('allocation.status IN (:...statuses)', {
        statuses: [
          FundAllocationStatus.APPROVED,
          FundAllocationStatus.COMPLETED,
        ],
      })
      .getRawOne();

    return result.totalAmount || 0;
  }

  /**
   * 获取资金分配统计数据
   */
  async getStatistics(): Promise<{
    totalAllocations: number;
    pendingAmount: number;
    approvedAmount: number;
    completedAmount: number;
    rejectedAmount: number;
  }> {
    // 获取各状态的资金总额
    const pendingResult = await this.fundAllocationRepository
      .createQueryBuilder('allocation')
      .select('SUM(allocation.amount)', 'amount')
      .where('allocation.status = :status', {
        status: FundAllocationStatus.PENDING,
      })
      .getRawOne();

    const approvedResult = await this.fundAllocationRepository
      .createQueryBuilder('allocation')
      .select('SUM(allocation.amount)', 'amount')
      .where('allocation.status = :status', {
        status: FundAllocationStatus.APPROVED,
      })
      .getRawOne();

    const completedResult = await this.fundAllocationRepository
      .createQueryBuilder('allocation')
      .select('SUM(allocation.amount)', 'amount')
      .where('allocation.status = :status', {
        status: FundAllocationStatus.COMPLETED,
      })
      .getRawOne();

    const rejectedResult = await this.fundAllocationRepository
      .createQueryBuilder('allocation')
      .select('SUM(allocation.amount)', 'amount')
      .where('allocation.status = :status', {
        status: FundAllocationStatus.REJECTED,
      })
      .getRawOne();

    const totalResult = await this.fundAllocationRepository
      .createQueryBuilder('allocation')
      .select('COUNT(allocation.id)', 'count')
      .getRawOne();

    return {
      totalAllocations: parseInt(totalResult.count) || 0,
      pendingAmount: pendingResult.amount || 0,
      approvedAmount: approvedResult.amount || 0,
      completedAmount: completedResult.amount || 0,
      rejectedAmount: rejectedResult.amount || 0,
    };
  }
}
