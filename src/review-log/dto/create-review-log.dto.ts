import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum ReviewResult {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision',
}

/**
 * 用于提交审核记录的 DTO
 */
export class CreateReviewLogDto {
  // 关联的项目申请ID
  @IsNumber()
  @IsNotEmpty()
  application_id: number;

  // 审核人员ID（通常可从JWT中获取，但这里作为参数传入也可）
  @IsNumber()
  @IsNotEmpty()
  reviewer_id: number;

  // 审核阶段，例如1代表初审，2代表复审
  @IsNumber()
  @IsNotEmpty()
  review_stage: number;

  // 审核意见，必填
  @IsString()
  @IsNotEmpty()
  review_opinion: string;

  // 审核结果，枚举值：approved、rejected 或 needs_revision
  @IsEnum(ReviewResult)
  @IsNotEmpty()
  review_result: ReviewResult;

  // 可选：审核附件（例如文件URL或路径）
  @IsString()
  @IsOptional()
  review_attachment?: string;
}
