import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectType } from '../entities/project.entity';

export class LocationDto {
  @ApiProperty({
    description: '省份',
    example: '广东省',
  })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({
    description: '城市',
    example: '深圳市',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({
    description: '区县',
    example: '南山区',
  })
  @IsString()
  @IsOptional()
  district: string;

  @ApiPropertyOptional({
    description: '详细地址',
    example: '粤海街道科技南路16号',
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional({
    description: '坐标，格式[经度,纬度]',
    example: [114.057868, 22.543099],
  })
  @IsArray()
  @IsOptional()
  coordinates: [number, number];
}

export class CreateProjectDto {
  @ApiProperty({
    description: '项目标题',
    example: '乡村教育振兴计划',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: '项目简介',
    example: '为偏远地区的孩子提供优质教育资源和学习环境',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '项目类型',
    enum: ProjectType,
    example: ProjectType.GENERAL_FUND,
  })
  @IsEnum(ProjectType)
  @IsNotEmpty()
  projectType: ProjectType;

  @ApiPropertyOptional({
    description: '项目封面图片URL',
    example: 'https://example.com/images/project-cover.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({
    description: '目标筹款金额（元）',
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  targetAmount: number;

  @ApiProperty({
    description: '项目开始日期',
    example: '2023-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiPropertyOptional({
    description: '项目结束日期',
    example: '2023-12-31T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({
    description: '项目状态',
    example: 'ongoing',
    enum: ['pending', 'ongoing', 'completed', 'failed'],
  })
  @IsEnum(['pending', 'ongoing', 'completed', 'failed'])
  @IsOptional()
  status: string;

  @ApiPropertyOptional({
    description: '项目地点信息',
    type: LocationDto,
  })
  @IsOptional()
  location: LocationDto;

  @ApiProperty({
    description: '项目类别',
    example: ['教育', '儿童'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  category: string[];

  @ApiPropertyOptional({
    description: '受益人数',
    example: 500,
  })
  @IsNumber()
  @IsOptional()
  beneficiaries: number;

  @ApiPropertyOptional({
    description: '项目详细内容（富文本）',
    example: '<p>本项目旨在为偏远山区的孩子们提供教育资源和改善学习环境...</p>',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiPropertyOptional({
    description: '项目图片集合',
    example: [
      'https://example.com/images/project-1.jpg',
      'https://example.com/images/project-2.jpg',
    ],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  gallery: string[];
}
