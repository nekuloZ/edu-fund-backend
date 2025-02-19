import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFundInstitutionDto {
  // 搜索关键字，通常针对机构名称
  @IsOptional()
  @IsString()
  q?: string;

  // 当前页码，最小值为 1
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

  // 排序字段，例如 'institution_name:asc' 或 'created_at:desc'
  @IsOptional()
  @IsString()
  sort?: string;
}
