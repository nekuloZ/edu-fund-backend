import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPermissionDto {
  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小值为1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
    minimum: 1,
    required: false,
  })
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小值为1' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: '关键词搜索（权限名称或编码）',
    example: '用户管理',
    required: false,
  })
  @IsString({ message: '关键词必须是字符串' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    description: '所属模块',
    example: 'user',
    required: false,
  })
  @IsString({ message: '模块必须是字符串' })
  @IsOptional()
  module?: string;

  @ApiPropertyOptional({
    description: '是否激活',
    example: true,
    required: false,
  })
  @IsBoolean({ message: '状态必须是布尔值' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}
