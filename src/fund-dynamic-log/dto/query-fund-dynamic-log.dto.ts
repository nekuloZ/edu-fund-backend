import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFundDynamicLogDto {
  // 可根据日志类型进行筛选
  @IsOptional()
  @IsString({ message: '日志类型必须为字符串' })
  logType?: string;

  // 可根据资金来源进行筛选
  @IsOptional()
  @IsString({ message: '资金来源必须为字符串' })
  fundSource?: string;

  // 可根据资金去向进行筛选
  @IsOptional()
  @IsString({ message: '资金去向必须为字符串' })
  fundDestination?: string;

  // 日期范围查询：起始日期（ISO 格式字符串）
  @IsOptional()
  @IsString({ message: '起始日期必须为字符串（ISO 格式）' })
  startDate?: string;

  // 日期范围查询：结束日期（ISO 格式字符串）
  @IsOptional()
  @IsString({ message: '结束日期必须为字符串（ISO 格式）' })
  endDate?: string;

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

  // 可选排序字段，例如根据交易日期或资金变动金额排序
  @IsOptional()
  @IsString({ message: '排序字段必须为字符串' })
  sortBy?: string;

  // 排序方式：asc 或 desc
  @IsOptional()
  @IsString({ message: '排序方式必须为字符串' })
  order?: string;
}
