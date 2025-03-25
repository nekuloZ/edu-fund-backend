import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
  })
  @IsString({ message: '权限名称必须是字符串' })
  @IsNotEmpty({ message: '权限名称不能为空' })
  name: string;

  @ApiProperty({
    description: '权限编码',
    example: 'user:manage',
  })
  @IsString({ message: '权限编码必须是字符串' })
  @IsNotEmpty({ message: '权限编码不能为空' })
  code: string;

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
    default: true,
    required: false,
  })
  @IsBoolean({ message: '状态必须是布尔值' })
  @IsOptional()
  isActive?: boolean;
}
