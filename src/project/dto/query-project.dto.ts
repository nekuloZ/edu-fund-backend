import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectType } from '../entities/project.entity';

export class QueryProjectDto {
  @ApiPropertyOptional({
    description: '搜索关键词',
    example: '教育援助',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: '项目类别列表',
    example: ['教育', '医疗', '扶贫'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiPropertyOptional({
    description: '项目类型列表',
    enum: ProjectType,
    isArray: true,
    example: [ProjectType.GRANT, ProjectType.SCHOLARSHIP],
  })
  @IsOptional()
  @IsEnum(ProjectType, { each: true })
  projectType?: ProjectType[];

  @ApiPropertyOptional({
    description: '项目状态列表',
    example: ['pending', 'ongoing'],
    enum: ['pending', 'ongoing', 'completed', 'failed'],
    type: [String],
  })
  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed', 'failed'], { each: true })
  status?: string[];

  @ApiPropertyOptional({
    description: '省份',
    example: '广东省',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: '城市',
    example: '深圳市',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: '开始日期',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: '结束日期',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: '排序字段',
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'targetAmount',
      'raisedAmount',
      'progress',
      'startDate',
    ],
  })
  @IsOptional()
  @IsEnum([
    'createdAt',
    'targetAmount',
    'raisedAmount',
    'progress',
    'startDate',
  ])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: '排序方向',
    example: 'DESC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
