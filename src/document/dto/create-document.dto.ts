import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DocumentCategory {
  ANNUAL_REPORT = 'annual-report',
  FINANCIAL_STATEMENT = 'financial-statement',
  PROJECT_DOCUMENT = 'project-document',
  OTHER = 'other',
}

export class CreateDocumentDto {
  @ApiProperty({
    description: '文档名称',
    example: '2023年度财务报告',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '文档URL',
    example: '/documents/financial-report-2023.pdf',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: '文档MIME类型',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: '文档大小（字节）',
    example: 1024000,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  size: number;

  @ApiProperty({
    description: '文档类别',
    enum: DocumentCategory,
    example: DocumentCategory.ANNUAL_REPORT,
  })
  @IsEnum(DocumentCategory)
  @IsNotEmpty()
  category: DocumentCategory;

  @ApiPropertyOptional({
    description: '文档年份',
    example: 2023,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({
    description: '关联项目ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    description: '是否公开',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = true;
}
