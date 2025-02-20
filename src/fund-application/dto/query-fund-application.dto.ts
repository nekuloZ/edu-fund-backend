import { IsOptional, IsString, IsNumber } from 'class-validator';

export class QueryFundApplicationDto {
  // 支持关键字搜索（可在标题、描述等字段中匹配）
  @IsOptional()
  @IsString()
  keyword?: string;

  // 根据申请状态进行过滤，例如 submitted、pending_review、approved、rejected
  @IsOptional()
  @IsString()
  status?: string;

  // 分页参数：页码与每页记录数
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
