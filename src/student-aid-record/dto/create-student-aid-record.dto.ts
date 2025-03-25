import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsUUID,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AidType } from '../entities/student-aid-record.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentAidRecordDto {
  @ApiProperty({
    description: '受助学生ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiPropertyOptional({
    description: '关联项目ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    description: '资助金额（元）',
    example: 1000.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: '资助日期',
    example: '2023-06-15T08:00:00Z',
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: '资助类型',
    example: AidType.TUITION,
    enum: AidType,
  })
  @IsEnum(AidType)
  @IsNotEmpty()
  aidType: AidType;

  @ApiProperty({
    description: '资助用途',
    example: '支付本学期学费',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  purpose: string;

  @ApiPropertyOptional({
    description: '备注信息',
    example: '该学生家庭经济困难，由于父亲突发疾病，需要额外资助',
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}
