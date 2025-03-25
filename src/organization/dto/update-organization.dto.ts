import {
  IsString,
  IsOptional,
  IsUrl,
  IsEmail,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({
    description: '联系电话',
    example: '010-12345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: '联系邮箱',
    example: 'contact@example.org',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: '联系地址',
    example: '北京市海淀区',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}

export class SocialMediaDto {
  @ApiProperty({
    description: '微博链接',
    example: 'https://weibo.com/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  weibo?: string;

  @ApiProperty({
    description: '微信公众号',
    example: 'wechat_example',
    required: false,
  })
  @IsString()
  @IsOptional()
  wechat?: string;

  @ApiProperty({
    description: 'Facebook链接',
    example: 'https://facebook.com/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    description: 'Twitter链接',
    example: 'https://twitter.com/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  twitter?: string;
}

export class UpdateOrganizationDto {
  @ApiProperty({
    description: '机构名称',
    example: '爱心助学公益组织',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '机构Logo',
    example: '/uploads/logo.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    description: '机构描述',
    example: '致力于帮助贫困地区学生，提供教育资源支持',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '官方网站',
    example: 'https://www.example.org',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: '联系方式', type: ContactDto, required: false })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  contact?: ContactDto;

  @ApiProperty({
    description: '社交媒体',
    type: SocialMediaDto,
    required: false,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  @ApiProperty({
    description: '法律信息',
    example: '注册号: 110108000000000',
    required: false,
  })
  @IsString()
  @IsOptional()
  legalInfo?: string;
}
