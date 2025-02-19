import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectType } from './create-fund-application.dto';

export class QueryFundApplicationDto {
  // 搜索关键字（用于匹配标题、描述或申请人信息）
  @IsOptional()
  @IsString()
  q?: string;

  // 按申请状态过滤，如 submitted、pending_review、approved、rejected、needs_revision
  @IsOptional()
  @IsString()
  status?: string;

  // 按项目类型筛选
  @IsOptional()
  @IsEnum(ProjectType)
  project_type?: ProjectType;

  // 当前页码（最小值为 1）
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  // 每页条数（最小值为 1）
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  // 排序字段，例如 "submission_date:desc" 或 "amount_requested:asc"
  @IsOptional()
  @IsString()
  sort?: string;
}
