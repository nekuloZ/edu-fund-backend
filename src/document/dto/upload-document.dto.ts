import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentCategory } from './create-document.dto';

export class UploadDocumentDto {
  @ApiProperty({
    description: '文档名称',
    example: '2023年度财务报告',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
    description: '是否公开',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = true;
}
