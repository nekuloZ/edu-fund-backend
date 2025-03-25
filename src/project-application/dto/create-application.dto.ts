import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({
    description: '申请人姓名',
    example: '张三',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  applicantName: string;

  @ApiProperty({
    description: '申请人所属组织/机构',
    example: '希望小学',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  applicantOrganization: string;

  @ApiProperty({
    description: '申请人邮箱',
    example: 'zhangsan@example.com',
    maxLength: 50,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  applicantEmail: string;

  @ApiProperty({
    description: '申请人联系电话',
    example: '13800138000',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  applicantPhone: string;

  @ApiProperty({
    description: '申请金额（元）',
    example: 50000,
  })
  @IsNumber()
  @IsNotEmpty()
  requestedAmount: number;

  @ApiProperty({
    description: '申请用途',
    example: '用于购买教学设备和改善教室环境',
  })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiPropertyOptional({
    description: '详细信息（可包含预算明细等）',
    example: { budget: { equipment: 30000, renovation: 20000 } },
  })
  @IsOptional()
  details?: object;

  @ApiPropertyOptional({
    description: '关联的项目ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  @IsOptional()
  projectId?: string;
}
