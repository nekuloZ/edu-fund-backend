import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BatchReviewDto {
  @ApiProperty({
    description: '待审核的申请ID列表',
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  ids: string[];

  @ApiProperty({
    description: '批量审核结果',
    example: 'approved',
    enum: ['approved', 'rejected'],
  })
  @IsEnum(['approved', 'rejected'])
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({
    description: '审核意见',
    example: '所有申请已通过，资金将于下周统一拨付',
  })
  @IsString()
  @IsOptional()
  reviewComment?: string;
}
