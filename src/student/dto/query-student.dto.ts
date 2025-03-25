import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from './create-student.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryStudentDto {
  @ApiPropertyOptional({
    description: '搜索关键词（支持学生姓名）',
    example: '张三',
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    description: '学校名称',
    example: '希望小学',
  })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiPropertyOptional({
    description: '年级',
    example: '六年级',
  })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional({
    description: '性别',
    example: Gender.MALE,
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({
    description: '省份',
    example: '广东省',
  })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({
    description: '城市',
    example: '广州市',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
