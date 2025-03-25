import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAcademicProgressDto } from './create-academic-progress.dto';

export class UpdateAcademicProgressDto extends PartialType(
  CreateAcademicProgressDto,
) {
  @ApiProperty({
    description: '用于更新的学业进度信息',
    type: CreateAcademicProgressDto,
  })
  _placeholder?: never;
}
