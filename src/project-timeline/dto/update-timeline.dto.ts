import { PartialType } from '@nestjs/mapped-types';
import { CreateTimelineDto } from './create-timeline.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {
  @ApiPropertyOptional({
    description: '项目ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  @IsOptional()
  projectId?: string;
}
