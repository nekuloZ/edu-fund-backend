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
import { ApiProperty } from '@nestjs/swagger';

export class CreateDonationDto {
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
    description: '捐赠类型',
    example: 'onetime',
    enum: ['onetime', 'monthly', 'quarterly', 'yearly'],
    default: 'onetime',
  })
  @IsEnum(['onetime', 'monthly', 'quarterly', 'yearly'])
  @IsNotEmpty()
  donationType: string = 'onetime';

  @ApiProperty({
    description: '捐赠留言',
    example: '希望能帮助到有需要的人',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: '是否匿名捐赠',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean = false;

  // 如果用户已登录，下面的字段可以为空
  // 如果用户未登录，则为必填
  @ApiProperty({
    description: '捐赠者姓名',
    example: '张三',
    required: false,
  })
  @IsString()
  @IsOptional()
  donorName?: string;

  @ApiProperty({
    description: '捐赠者邮箱',
    example: 'donor@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  donorEmail?: string;

  @ApiProperty({
    description: '捐赠者电话',
    example: '13800138000',
    required: false,
  })
  @IsString()
  @IsOptional()
  donorPhone?: string;
}
