import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AidType } from '../entities/student-aid-record.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryStudentAidRecordDto {
  @ApiPropertyOptional({
    description: '学生ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({
    description: '项目ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    description: '资助类型',
    example: AidType.TUITION,
    enum: AidType,
  })
  @IsEnum(AidType)
  @IsOptional()
  aidType?: AidType;

  @ApiPropertyOptional({
    description: '是否已确认',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  acknowledged?: boolean;

  @ApiPropertyOptional({
    description: '开始日期',
    example: '2023-01-01T00:00:00Z',
    type: Date,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: '结束日期',
    example: '2023-12-31T23:59:59Z',
    type: Date,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
