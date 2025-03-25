import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    default: 1,
    required: false,
  })
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小值为1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    default: 10,
    required: false,
  })
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小值为1' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: '搜索关键词',
    example: '张三',
    required: false,
  })
  @IsString({ message: '搜索关键词必须是字符串' })
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    description: '用户角色',
    example: 'admin',
    required: false,
  })
  @IsString({ message: '角色名称必须是字符串' })
  @IsOptional()
  role?: string;

  @ApiProperty({
    description: '用户状态',
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
