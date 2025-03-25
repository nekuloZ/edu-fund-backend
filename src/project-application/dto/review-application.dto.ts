import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewApplicationDto {
  @ApiProperty({
    description: '审核结果',
    example: 'approved',
    enum: ['approved', 'rejected'],
  })
  @IsEnum(['approved', 'rejected'])
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({
    description: '审核意见',
    example: '申请已通过，资金将于下周拨付',
  })
  @IsString()
  @IsOptional()
  reviewComment?: string;
}
