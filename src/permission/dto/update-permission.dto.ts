import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
    required: false,
  })
  @IsString({ message: '权限名称必须是字符串' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '权限编码',
    example: 'user:manage',
    required: false,
  })
  @IsString({ message: '权限编码必须是字符串' })
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: '权限描述',
    example: '用户管理相关权限',
    required: false,
  })
  @IsString({ message: '权限描述必须是字符串' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '所属模块',
    example: 'user',
    required: false,
  })
  @IsString({ message: '所属模块必须是字符串' })
  @IsOptional()
  module?: string;

  @ApiProperty({
    description: '是否激活',
    example: true,
    required: false,
  })
  @IsBoolean({ message: '状态必须是布尔值' })
  @IsOptional()
  isActive?: boolean;
}
