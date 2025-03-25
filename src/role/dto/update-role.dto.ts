import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: '角色名称',
    example: 'admin',
    required: false,
  })
  @IsString({ message: '角色名称必须是字符串' })
  @IsOptional()
  name?: string;

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
    required: false,
  })
  @IsBoolean({ message: '状态必须是布尔值' })
  @IsOptional()
  isActive?: boolean;
}
