import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimelineDto {
  @ApiProperty({
    description: '项目ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: '时间点日期',
    example: '2023-06-15T08:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: '时间点标题',
    example: '项目启动仪式',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: '时间点详细描述',
    example: '在当地小学举行了项目启动仪式，向学生们发放了新教材和学习用品',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: '相关图片URL列表',
    example: [
      'https://example.com/images/event1.jpg',
      'https://example.com/images/event2.jpg',
    ],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  images?: string[];
}
