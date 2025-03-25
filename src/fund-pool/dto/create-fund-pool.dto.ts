import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFundPoolDto {
  @ApiProperty({
    description: '资金池名称',
    example: '2024年度慈善基金池',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '资金池描述信息',
    example: '用于2024年度慈善项目的资金池',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '资金池初始余额',
    example: 1000000,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  balance?: number;
}
