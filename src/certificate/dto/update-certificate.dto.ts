import { PartialType } from '@nestjs/mapped-types';
import { CreateCertificateDto } from './create-certificate.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {
  @ApiPropertyOptional({
    description: '证书文件URL',
    example: 'https://example.com/certificates/cert-12345.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional({
    description: '是否已下载',
    example: true,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDownloaded?: boolean;
}
