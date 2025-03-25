import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryApplicationDto {
  @ApiPropertyOptional({
    description: '搜索关键词（支持申请人姓名、所属组织搜索）',
    example: '希望小学',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: '申请状态筛选',
    example: ['pending', 'approved'],
    enum: ['pending', 'approved', 'rejected'],
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'], { each: true })
  status?: string | string[];

  @ApiPropertyOptional({
    description: '关联的项目ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

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
    description: '排序字段',
    example: 'createdAt',
    default: 'createdAt',
    enum: ['createdAt', 'applicantName', 'requestedAmount'],
  })
  @IsOptional()
  @IsEnum(['createdAt', 'applicantName', 'requestedAmount'])
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
