import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 用于查询项目申请附件列表的数据结构
 */
export class QueryApplicationAttachmentDto {
  // 根据项目申请ID查询附件，必填
  @Type(() => Number)
  @IsNumber()
  application_id: number;

  // 可选：分页当前页码，最小值为1
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  // 可选：每页条数，最小值为1
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
