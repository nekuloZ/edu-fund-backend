import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 用于角色列表查询，支持关键字搜索、分页和排序。
 */
export class QueryRoleDto {
  // 搜索关键字，通常针对角色名称
  @IsOptional()
  @IsString()
  q?: string;

  // 分页页码，最小值为 1
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  // 每页条数，最小值为 1
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  // 排序字段，例如 'role_name:asc' 或 'created_at:desc'
  @IsOptional()
  @IsString()
  sort?: string;
}
