import { PartialType } from '@nestjs/swagger';
import { CreateStudentAidRecordDto } from './create-student-aid-record.dto';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentAidRecordDto extends PartialType(
  CreateStudentAidRecordDto,
) {
  @ApiPropertyOptional({
    description: '是否已确认收到资助',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  acknowledged?: boolean;

  @ApiPropertyOptional({
    description: '确认日期',
    example: '2023-06-20T10:00:00Z',
    type: Date,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  acknowledgedAt?: Date;
}
