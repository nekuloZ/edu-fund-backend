import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum TimelineType {
  MILESTONE = 'milestone',
  PROGRESS = 'progress',
  EVENT = 'event',
}

export enum TimelineStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export class CreateProjectTimelineDto {
  @ApiProperty({ description: '项目ID' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ description: '时间线标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '时间线描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '时间线日期' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ description: '时间线类型', enum: TimelineType })
  @IsEnum(TimelineType)
  type: TimelineType;

  @ApiProperty({ description: '时间线状态', enum: TimelineStatus })
  @IsEnum(TimelineStatus)
  status: TimelineStatus;
}
