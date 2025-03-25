import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PeriodicDonationDto {
  @ApiProperty({
    description: '项目ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: '捐赠金额',
    example: 100,
    minimum: 0.01,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: '捐赠频率',
    example: 'monthly',
    enum: ['monthly', 'quarterly', 'yearly'],
  })
  @IsEnum(['monthly', 'quarterly', 'yearly'])
  @IsNotEmpty()
  frequency: string;

  @ApiPropertyOptional({
    description: '捐赠留言',
    example: '希望能持续帮助需要的人',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: '是否匿名捐赠',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean = false;
}
