import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryNotificationDto {
  // 根据接收者ID进行筛选
  @IsOptional()
  @IsNumber({}, { message: '接收者ID必须为数字' })
  recipientId?: number;

  // 根据通知状态筛选
  @IsOptional()
  @IsString({ message: '通知状态必须为字符串' })
  status?: string;

  // 根据通知类型筛选
  @IsOptional()
  @IsString({ message: '通知类型必须为字符串' })
  notificationType?: string;

  // 时间范围筛选：开始时间（ISO 格式字符串）
  @IsOptional()
  @IsString({ message: '开始时间必须为字符串（ISO格式）' })
  startDate?: string;

  // 时间范围筛选：结束时间（ISO 格式字符串）
  @IsOptional()
  @IsString({ message: '结束时间必须为字符串（ISO格式）' })
  endDate?: string;

  // 关键字搜索（可匹配标题、内容等）
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

  // 可选排序字段，例如按照创建时间、通知标题排序
  @IsOptional()
  @IsString({ message: '排序字段必须为字符串' })
  sortBy?: string;

  // 排序方式：asc 或 desc
  @IsOptional()
  @IsString({ message: '排序方式必须为字符串' })
  order?: string;
}
