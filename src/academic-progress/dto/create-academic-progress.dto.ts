import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
  IsDate,
  ValidateNested,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgressStatus } from '../entities/academic-progress.entity';

export class GradeDto {
  @ApiProperty({
    description: '学科名称',
    example: '数学',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: '分数',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  score: number;

  @ApiPropertyOptional({
    description: '学科排名',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  ranking?: number;
}

export class CreateAcademicProgressDto {
  @ApiProperty({
    description: '学生ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: '学期',
    example: '2023-2024学年第一学期',
  })
  @IsString()
  @IsNotEmpty()
  semester: string;

  @ApiProperty({
    description: '成绩列表',
    type: [GradeDto],
    example: [
      { subject: '数学', score: 85, ranking: 5 },
      { subject: '语文', score: 90, ranking: 3 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeDto)
  grades: GradeDto[];

  @ApiPropertyOptional({
    description: '平均分数',
    example: 87.5,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  averageScore?: number;

  @ApiPropertyOptional({
    description: '总体排名',
    example: 10,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  ranking?: number;

  @ApiPropertyOptional({
    description: '学业状态',
    enum: ProgressStatus,
    example: ProgressStatus.GOOD,
    default: ProgressStatus.AVERAGE,
    required: false,
  })
  @IsEnum(ProgressStatus)
  @IsOptional()
  status?: ProgressStatus;

  @ApiPropertyOptional({
    description: '教师评语',
    example: '该学生学习态度认真，但需要加强数学练习。',
    required: false,
  })
  @IsString()
  @IsOptional()
  teacherComment?: string;

  @ApiPropertyOptional({
    description: '综合评估',
    example: '良好，建议继续保持学习热情。',
    required: false,
  })
  @IsString()
  @IsOptional()
  assessment?: string;

  @ApiPropertyOptional({
    description: '考试日期',
    example: '2023-12-25T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  examDate?: Date;
}
