import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectApplicationDto {
  @ApiProperty({
    description: '项目标题',
    example: '乡村儿童教育援助计划',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: '项目简要描述',
    example: '为贫困地区的儿童提供教育资源和学习条件改善',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '目标筹款金额（元）',
    example: 50000,
  })
  @IsNumber()
  @IsNotEmpty()
  targetAmount: number;

  @ApiProperty({
    description: '申请人姓名',
    example: '张三',
  })
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @ApiProperty({
    description: '联系电话',
    example: '13800138000',
  })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiPropertyOptional({
    description: '联系邮箱',
    example: 'zhangsan@example.com',
  })
  @IsString()
  @IsOptional()
  contactEmail: string;

  @ApiProperty({
    description: '项目类别',
    example: ['教育', '儿童'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  category: string[];

  @ApiPropertyOptional({
    description: '省份',
    example: '云南省',
  })
  @IsString()
  @IsOptional()
  province: string;

  @ApiPropertyOptional({
    description: '城市',
    example: '昆明市',
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiPropertyOptional({
    description: '项目详细内容',
    example: '本项目旨在为云南省昆明市偏远山区的小学提供教学设备...',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiPropertyOptional({
    description: '附件文件列表',
    example: ['https://example.com/files/project_plan.pdf'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  attachments: string[];
}
