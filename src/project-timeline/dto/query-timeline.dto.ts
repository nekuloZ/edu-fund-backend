import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TimelineType, TimelineStatus } from './create-project-timeline.dto';

export class QueryTimelineDto {
  @ApiProperty({ description: '项目ID', required: false })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ description: '开始日期', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: '结束日期', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: '页码', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', default: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: '时间线类型',
    required: false,
    enum: TimelineType,
  })
  @IsEnum(TimelineType)
  @IsOptional()
  type?: TimelineType;

  @ApiProperty({
    description: '时间线状态',
    required: false,
    enum: TimelineStatus,
  })
  @IsEnum(TimelineStatus)
  @IsOptional()
  status?: TimelineStatus;

  @ApiProperty({ description: '关键字搜索', required: false })
  @IsString()
  @IsOptional()
  keyword?: string;
}
