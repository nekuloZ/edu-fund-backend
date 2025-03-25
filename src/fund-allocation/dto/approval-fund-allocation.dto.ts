import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FundAllocationStatus } from './update-fund-allocation.dto';

export class ApprovalFundAllocationDto {
  @ApiProperty({
    description: '审批状态',
    enum: [FundAllocationStatus.APPROVED, FundAllocationStatus.REJECTED],
    example: FundAllocationStatus.APPROVED,
  })
  @IsEnum(FundAllocationStatus, {
    message: '审批状态必须是approved或rejected',
  })
  @IsNotEmpty()
  status: FundAllocationStatus.APPROVED | FundAllocationStatus.REJECTED;

  @ApiPropertyOptional({
    description: '审批意见',
    example: '同意分配资金，请按计划执行',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
