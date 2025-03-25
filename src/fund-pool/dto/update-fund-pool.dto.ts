import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFundPoolDto {
  @ApiPropertyOptional({
    description: '资金池总余额',
    example: 1000000,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  totalBalance?: number;

  @ApiPropertyOptional({
    description: '资金池可用余额',
    example: 800000,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  availableBalance?: number;

  @ApiPropertyOptional({
    description: '已分配金额',
    example: 150000,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  allocatedAmount?: number;

  @ApiPropertyOptional({
    description: '待审批金额',
    example: 50000,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  pendingAmount?: number;

  @ApiPropertyOptional({
    description: '资金池警戒线',
    example: 100000,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  warningLine?: number;
}
