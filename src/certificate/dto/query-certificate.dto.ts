import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCertificateDto {
  @ApiPropertyOptional({
    description: '捐赠记录ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  donationId?: string;

  @ApiPropertyOptional({
    description: '证书编号',
    example: 'CERT-20231225-00001',
    required: false,
  })
  @IsString()
  @IsOptional()
  certificateNumber?: string;

  @ApiPropertyOptional({
    description: '证书接收人姓名',
    example: '张三',
    required: false,
  })
  @IsString()
  @IsOptional()
  recipientName?: string;

  @ApiPropertyOptional({
    description: '开始日期',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: '结束日期',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
