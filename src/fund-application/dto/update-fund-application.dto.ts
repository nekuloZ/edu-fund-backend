import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateFundApplicationDto {
  // 允许在申请状态为 submitted 或 pending_review 时修改的字段

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amountRequested?: number;

  @IsOptional()
  @IsString()
  usePlan?: string;

  @IsOptional()
  @IsNumber()
  projectTypeId: number;
}
