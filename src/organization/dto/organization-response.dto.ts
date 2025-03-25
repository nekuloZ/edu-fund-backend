import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ description: '机构ID', example: 1 })
  id: number;

  @ApiProperty({ description: '机构名称', example: '爱心助学公益组织' })
  name: string;

  @ApiProperty({ description: '机构Logo', example: '/uploads/logo.png' })
  logo: string;

  @ApiProperty({
    description: '机构描述',
    example: '致力于帮助贫困地区学生，提供教育资源支持',
  })
  description: string;

  @ApiProperty({ description: '官方网站', example: 'https://www.example.org' })
  website: string;

  @ApiProperty({
    description: '联系方式',
    example: {
      phone: '010-12345678',
      email: 'contact@example.org',
      address: '北京市海淀区',
    },
  })
  contact: {
    phone: string;
    email: string;
    address: string;
  };

  @ApiProperty({
    description: '社交媒体',
    example: {
      weibo: 'https://weibo.com/example',
      wechat: 'wechat_example',
      facebook: 'https://facebook.com/example',
      twitter: 'https://twitter.com/example',
    },
  })
  socialMedia: {
    weibo?: string;
    wechat?: string;
    facebook?: string;
    twitter?: string;
  };

  @ApiProperty({ description: '法律信息', example: '注册号: 110108000000000' })
  legalInfo: string;

  @ApiProperty({ description: '更新时间', example: '2024-03-24T10:30:00Z' })
  updatedAt: Date;
}

export class PublicOrganizationDto {
  @ApiProperty({ description: '机构名称', example: '爱心助学公益组织' })
  name: string;

  @ApiProperty({ description: '机构Logo', example: '/uploads/logo.png' })
  logo: string;

  @ApiProperty({
    description: '机构描述',
    example: '致力于帮助贫困地区学生，提供教育资源支持',
  })
  description: string;

  @ApiProperty({ description: '官方网站', example: 'https://www.example.org' })
  website: string;

  @ApiProperty({
    description: '联系方式',
    example: {
      phone: '010-12345678',
      email: 'contact@example.org',
      address: '北京市海淀区',
    },
  })
  contact: {
    phone: string;
    email: string;
    address: string;
  };

  @ApiProperty({
    description: '社交媒体',
    example: {
      weibo: 'https://weibo.com/example',
      wechat: 'wechat_example',
      facebook: 'https://facebook.com/example',
      twitter: 'https://twitter.com/example',
    },
  })
  socialMedia: {
    weibo?: string;
    wechat?: string;
    facebook?: string;
    twitter?: string;
  };
}
