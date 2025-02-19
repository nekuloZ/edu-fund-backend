import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 用于查询审核记录列表的 DTO
 */
export class QueryReviewLogDto {
  // 根据项目申请ID筛选
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  application_id?: number;

  // 根据审核人员ID筛选
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  reviewer_id?: number;

  // 根据审核阶段筛选
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  review_stage?: number;

  // 可选：关键字搜索（可用于匹配审核意见内容）
  @IsOptional()
  @IsString()
  q?: string;

  // 分页：当前页码
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  // 分页：每页条数
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
