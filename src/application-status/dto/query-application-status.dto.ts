import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryApplicationStatusDto {
  // 支持关键字搜索，通常可用于状态名称或描述的模糊查询
  @IsOptional()
  @IsString()
  keyword?: string;

  // 分页参数：页码
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  // 分页参数：每页记录数
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
