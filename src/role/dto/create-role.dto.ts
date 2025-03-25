import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
    example: 'admin',
  })
  @IsString({ message: '角色名称必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  @ApiProperty({
    description: '角色描述',
    example: '系统管理员',
    required: false,
  })
  @IsString({ message: '角色描述必须是字符串' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '是否激活',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean({ message: '状态必须是布尔值' })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: '权限ID数组',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsArray({ message: '权限ID必须是数组' })
  @IsOptional()
  permissionIds?: number[];
}
