import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsObject,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class AddressDto {
  @ApiProperty({
    description: '省份',
    example: '广东省',
  })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({
    description: '城市',
    example: '广州市',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: '区/县',
    example: '天河区',
  })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    description: '详细地址',
    example: '天河路385号',
  })
  @IsString()
  @IsNotEmpty()
  detail: string;
}

export class CreateStudentDto {
  @ApiProperty({
    description: '学生姓名',
    example: '张三',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '性别',
    example: Gender.MALE,
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: '出生日期',
    example: '2010-01-01T00:00:00Z',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  birthdate: Date;

  @ApiPropertyOptional({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: '学校名称',
    example: '希望小学',
  })
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiPropertyOptional({
    description: '年级',
    example: '六年级',
  })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional({
    description: '班级',
    example: '2班',
  })
  @IsString()
  @IsOptional()
  class?: string;

  @ApiProperty({
    description: '家庭住址',
    type: AddressDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({
    description: '监护人姓名',
    example: '李四',
  })
  @IsString()
  @IsOptional()
  guardianName?: string;

  @ApiPropertyOptional({
    description: '监护人电话',
    example: '13800138000',
  })
  @IsString()
  @IsOptional()
  guardianPhone?: string;

  @ApiPropertyOptional({
    description: '与监护人关系',
    example: '父亲',
  })
  @IsString()
  @IsOptional()
  guardianRelationship?: string;

  @ApiPropertyOptional({
    description: '学生背景信息',
    example: '来自农村家庭，父母均为农民，家庭经济条件较为困难。',
  })
  @IsString()
  @IsOptional()
  background?: string;
}
