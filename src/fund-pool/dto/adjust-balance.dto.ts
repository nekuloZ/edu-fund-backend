import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export class AdjustBalanceDto {
  @ApiProperty({
    description: '金额',
    example: 10000,
    minimum: 0.01,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: '操作类型',
    enum: OperationType,
    example: OperationType.DEPOSIT,
  })
  @IsEnum(OperationType)
  @IsNotEmpty()
  operationType: OperationType;

  @ApiPropertyOptional({
    description: '操作说明',
    example: '项目资金注入',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '关联ID（如关联的项目ID或捐赠ID）',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  relatedId?: string;
}
