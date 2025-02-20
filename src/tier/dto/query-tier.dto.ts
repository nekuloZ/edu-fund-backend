import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTierDto {
  // 用于关键字搜索，可以匹配档次名称或适用条件
  @IsOptional()
  @IsString({ message: '关键字必须为字符串' })
  keyword?: string;

  // 分页参数：页码
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '页码必须为数字' })
  page?: number;

  // 分页参数：每页记录数
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '每页记录数必须为数字' })
  limit?: number;

  // 可选排序字段，例如 tierName 或 awardAmount
  @IsOptional()
  @IsString({ message: '排序字段必须为字符串' })
  sortBy?: string;

  // 排序方式，取值为 'asc' 或 'desc'
  @IsOptional()
  @IsString({ message: '排序方式必须为字符串' })
  order?: string;
}
