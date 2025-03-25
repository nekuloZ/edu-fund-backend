import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum FundAllocationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export class UpdateFundAllocationDto {
  @ApiPropertyOptional({
    description: '资金分配状态',
    enum: FundAllocationStatus,
    example: FundAllocationStatus.APPROVED,
    required: false,
  })
  @IsEnum(FundAllocationStatus)
  @IsOptional()
  status?: FundAllocationStatus;

  @ApiPropertyOptional({
    description: '分配说明',
    example: '用于项目第一阶段实施费用',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '审批意见',
    example: '同意分配资金，请按计划执行',
    required: false,
  })
  @IsString()
  @IsOptional()
  approvalComment?: string;
}
