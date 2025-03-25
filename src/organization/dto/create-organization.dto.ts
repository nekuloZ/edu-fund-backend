import {
  IsString,
  IsOptional,
  IsUrl,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: '组织名称',
    example: '希望工程基金会',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '组织描述',
    example: '致力于改善贫困地区教育条件的公益组织',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '组织logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    description: '组织网站',
    example: 'https://www.hope.org',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: '联系邮箱',
    example: 'contact@hope.org',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty({
    description: '联系电话',
    example: '400-123-4567',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({
    description: '组织地址',
    example: '北京市朝阳区xxx街道xxx号',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
