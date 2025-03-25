import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { FundAllocationStatus } from './update-fund-allocation.dto';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryFundAllocationDto {
  @ApiPropertyOptional({
    description: '项目ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

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
    description: '关键词搜索',
    example: '第一阶段',
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    description: '开始日期',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: '结束日期',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
