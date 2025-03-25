import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentCategory } from './create-document.dto';

export class QueryDocumentDto {
  @ApiPropertyOptional({
    description: '文档类别',
    enum: DocumentCategory,
    example: DocumentCategory.ANNUAL_REPORT,
    required: false,
  })
  @IsEnum(DocumentCategory)
  @IsOptional()
  category?: DocumentCategory;

  @ApiPropertyOptional({
    description: '文档年份',
    example: 2023,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({
    description: '关联项目ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    description: '关键词搜索',
    example: '财务报告',
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    description: '是否公开',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isPublic?: boolean;

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
