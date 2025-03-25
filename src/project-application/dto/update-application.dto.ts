import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiPropertyOptional({
    description: '申请状态',
    example: 'approved',
    enum: ['pending', 'approved', 'rejected'],
  })
  @IsEnum(['pending', 'approved', 'rejected'])
  @IsOptional()
  status?: string;
}
