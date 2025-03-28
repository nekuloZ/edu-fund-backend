import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { CreateApplicationDto } from './create-application.dto';
import { ProjectType } from '../../project/entities/project.entity';

export class CreateProjectApplicationDto extends CreateApplicationDto {
  @ApiProperty({ description: '项目名称' })
  @IsString()
  projectName: string;

  @ApiProperty({ description: '项目描述' })
  @IsString()
  description: string;

  @ApiProperty({
    description: '项目类型',
    enum: ProjectType,
    example: ProjectType.GRANT,
  })
  @IsEnum(ProjectType)
  projectType: ProjectType;

  @ApiProperty({ description: '目标金额' })
  @IsNumber()
  targetAmount: number;

  @ApiProperty({ description: '开始日期' })
  @IsString()
  startDate: string;

  @ApiProperty({ description: '结束日期' })
  @IsString()
  endDate: string;

  @ApiProperty({ description: '项目类别', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
