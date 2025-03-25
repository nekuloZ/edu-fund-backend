import {
  IsOptional,
  IsUUID,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProgressStatus } from '../entities/academic-progress.entity';

export class QueryAcademicProgressDto {
  @ApiPropertyOptional({
    description: '学生ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({
    description: '学期',
    example: '2023-2024学年第一学期',
    required: false,
  })
  @IsString()
  @IsOptional()
  semester?: string;

  @ApiPropertyOptional({
    description: '学业状态',
    enum: ProgressStatus,
    example: ProgressStatus.GOOD,
    required: false,
  })
  @IsEnum(ProgressStatus)
  @IsOptional()
  status?: ProgressStatus;

  @ApiPropertyOptional({
    description: '最低平均分',
    example: 70,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minAverageScore?: number;

  @ApiPropertyOptional({
    description: '最高平均分',
    example: 90,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxAverageScore?: number;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
