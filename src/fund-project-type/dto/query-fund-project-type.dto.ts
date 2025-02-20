import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFundProjectTypeDto {
  // 关键字搜索，匹配项目类型名称或描述中的内容
  @IsOptional()
  @IsString({ message: '关键字必须是字符串' })
  keyword?: string;

  // 分页参数：页码
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '页码必须是数字' })
  page?: number;

  // 分页参数：每页记录数
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '每页记录数必须是数字' })
  limit?: number;

  // 可选排序字段，例如根据 projectTypeName 排序
  @IsOptional()
  @IsString({ message: '排序字段必须是字符串' })
  sortBy?: string;

  // 可选排序方式，例如 asc 或 desc
  @IsOptional()
  @IsString({ message: '排序方式必须是字符串' })
  order?: string;
}
