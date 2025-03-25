import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCertificateDto {
  @ApiProperty({
    description: '捐赠记录ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  donationId: string;

  @ApiProperty({
    description: '证书接收人姓名',
    example: '张三',
  })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiPropertyOptional({
    description: '证书编号',
    example: 'CERT-20231225-00001',
    required: false,
  })
  @IsString()
  @IsOptional()
  certificateNumber?: string;
}
