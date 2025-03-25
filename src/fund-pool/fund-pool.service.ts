import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundPool } from './entities/fund-pool.entity';
import { UpdateFundPoolDto } from './dto/update-fund-pool.dto';
import { AdjustBalanceDto, OperationType } from './dto/adjust-balance.dto';
import { SetWarningLineDto } from './dto/set-warning-line.dto';
import { CreateFundPoolDto } from './dto/create-fund-pool.dto';

@Injectable()
export class FundPoolService {
  constructor(
    @InjectRepository(FundPool)
    private fundPoolRepository: Repository<FundPool>,
  ) {
    // 确保系统中总是有一个资金池记录
    this.initFundPool();
  }

  /**
   * 初始化资金池，如果不存在则创建
   */
  private async initFundPool(): Promise<void> {
    const count = await this.fundPoolRepository.count();
    if (count === 0) {
      const fundPool = this.fundPoolRepository.create({
        totalBalance: 0,
        availableBalance: 0,
        allocatedAmount: 0,
        pendingAmount: 0,
        warningLine: 10000, // 默认警戒线10000
      });
      await this.fundPoolRepository.save(fundPool);
    }
  }

  /**
   * 获取资金池
   */
  async getFundPool(): Promise<FundPool> {
    const fundPool = await this.fundPoolRepository.findOne({
      where: { id: 1 }, // 总是使用ID为1的记录
    });

    if (!fundPool) {
      throw new NotFoundException('资金池信息不存在');
    }

    return fundPool;
  }

  /**
   * 更新资金池信息
   */
  async updateFundPool(
    updateFundPoolDto: UpdateFundPoolDto,
  ): Promise<FundPool> {
    const fundPool = await this.getFundPool();

    // 更新资金池信息
    Object.assign(fundPool, updateFundPoolDto);

    return await this.fundPoolRepository.save(fundPool);
  }

  /**
   * 调整资金余额
   */
  async adjustBalance(adjustBalanceDto: AdjustBalanceDto): Promise<FundPool> {
    const { amount, operationType } = adjustBalanceDto;
    const fundPool = await this.getFundPool();

    if (operationType === OperationType.DEPOSIT) {
      // 存入资金
      fundPool.totalBalance += amount;
      fundPool.availableBalance += amount;
    } else if (operationType === OperationType.WITHDRAW) {
      // 提取资金
      if (fundPool.availableBalance < amount) {
        throw new BadRequestException('可用余额不足');
      }

      fundPool.totalBalance -= amount;
      fundPool.availableBalance -= amount;
    }

    // 保存更新后的资金池信息
    return await this.fundPoolRepository.save(fundPool);
  }

  /**
   * 设置警戒线
   */
  async setWarningLine(
    setWarningLineDto: SetWarningLineDto,
  ): Promise<FundPool> {
    const { warningLine } = setWarningLineDto;
    const fundPool = await this.getFundPool();

    fundPool.warningLine = warningLine;

    return await this.fundPoolRepository.save(fundPool);
  }

  /**
   * 获取资金状态
   */
  async getFundStatus(): Promise<{
    totalBalance: number;
    availableBalance: number;
    allocatedAmount: number;
    pendingAmount: number;
    warningLine: number;
    isUnderWarningLine: boolean;
    balancePercentage: number;
  }> {
    const fundPool = await this.getFundPool();

    // 计算可用余额占总余额的百分比
    const balancePercentage =
      fundPool.totalBalance > 0
        ? +((fundPool.availableBalance / fundPool.totalBalance) * 100).toFixed(
            2,
          )
        : 0;

    // 判断是否低于警戒线
    const isUnderWarningLine = fundPool.availableBalance < fundPool.warningLine;

    return {
      totalBalance: fundPool.totalBalance,
      availableBalance: fundPool.availableBalance,
      allocatedAmount: fundPool.allocatedAmount,
      pendingAmount: fundPool.pendingAmount,
      warningLine: fundPool.warningLine,
      isUnderWarningLine,
      balancePercentage,
    };
  }

  /**
   * 预分配资金
   */
  async allocateFunds(amount: number): Promise<FundPool> {
    const fundPool = await this.getFundPool();

    if (fundPool.availableBalance < amount) {
      throw new BadRequestException('可用余额不足，无法分配');
    }

    // 减少可用余额，增加分配金额
    fundPool.availableBalance -= amount;
    fundPool.allocatedAmount += amount;

    return await this.fundPoolRepository.save(fundPool);
  }

  /**
   * 取消资金分配
   */
  async deallocateFunds(amount: number): Promise<FundPool> {
    const fundPool = await this.getFundPool();

    if (fundPool.allocatedAmount < amount) {
      throw new BadRequestException('已分配金额不足，无法取消分配');
    }

    // 增加可用余额，减少分配金额
    fundPool.availableBalance += amount;
    fundPool.allocatedAmount -= amount;

    return await this.fundPoolRepository.save(fundPool);
  }

  /**
   * 标记待处理金额
   */
  async markPendingAmount(amount: number): Promise<FundPool> {
    const fundPool = await this.getFundPool();

    if (fundPool.availableBalance < amount) {
      throw new BadRequestException('可用余额不足，无法标记待处理');
    }

    // 减少可用余额，增加待处理金额
    fundPool.availableBalance -= amount;
    fundPool.pendingAmount += amount;

    return await this.fundPoolRepository.save(fundPool);
  }

  /**
   * 取消待处理金额
   */
  async unmarkPendingAmount(amount: number): Promise<FundPool> {
    const fundPool = await this.getFundPool();

    if (fundPool.pendingAmount < amount) {
      throw new BadRequestException('待处理金额不足，无法取消标记');
    }

    // 增加可用余额，减少待处理金额
    fundPool.availableBalance += amount;
    fundPool.pendingAmount -= amount;

    return await this.fundPoolRepository.save(fundPool);
  }

  async create(createFundPoolDto: CreateFundPoolDto, operatorId: string) {
    // TODO: 实现创建资金池的逻辑
    return {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ...createFundPoolDto,
      operator: { id: operatorId },
      createdAt: new Date().toISOString(),
    };
  }

  async findAll() {
    // TODO: 实现获取所有资金池的逻辑
    return [];
  }

  async findOne(id: string) {
    // TODO: 实现获取单个资金池的逻辑
    return {
      id,
      name: '示例资金池',
      description: '示例描述',
      balance: 1000000,
      status: 'active',
      operator: { id: '1', username: 'admin' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async update(id: string, updateFundPoolDto: UpdateFundPoolDto) {
    // TODO: 实现更新资金池的逻辑
    return {
      id,
      ...updateFundPoolDto,
      updatedAt: new Date().toISOString(),
    };
  }

  async getStatistics() {
    // TODO: 实现获取资金池统计数据的逻辑
    return {
      totalBalance: 5000000,
      activePools: 3,
      inactivePools: 1,
      totalPools: 4,
    };
  }
}
