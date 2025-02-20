import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDisbursementRecordDto {
  // 根据申请ID查询
  @IsOptional()
  @IsNumber({}, { message: '申请ID必须为数字' })
  applicationId?: number;

  // 根据操作员ID查询
  @IsOptional()
  @IsNumber({}, { message: '操作员ID必须为数字' })
  operatorId?: number;

  // 根据拨款状态查询（例如 pending、confirmed、failed）
  @IsOptional()
  @IsString({ message: '拨款状态必须为字符串' })
  status?: string;

  // 日期范围查询：开始日期（ISO 格式字符串）
  @IsOptional()
  @IsString({ message: '开始日期必须为字符串（ISO格式）' })
  startDate?: string;

  // 日期范围查询：结束日期（ISO 格式字符串）
  @IsOptional()
  @IsString({ message: '结束日期必须为字符串（ISO格式）' })
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

  // 可选排序字段，例如 disbursementDate 或 disbursementAmount
  @IsOptional()
  @IsString({ message: '排序字段必须为字符串' })
  sortBy?: string;

  // 排序方式，取值为 'asc' 或 'desc'
  @IsOptional()
  @IsString({ message: '排序方式必须为字符串' })
  order?: string;
}
