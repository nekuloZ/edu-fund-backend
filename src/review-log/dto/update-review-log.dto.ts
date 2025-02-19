import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { ReviewResult } from './create-review-log.dto';

/**
 * 用于更新审核记录的 DTO
 */
export class UpdateReviewLogDto {
  @IsOptional()
  @IsNumber()
  review_stage?: number;

  @IsOptional()
  @IsString()
  review_opinion?: string;

  @IsOptional()
  @IsEnum(ReviewResult)
  review_result?: ReviewResult;

  @IsOptional()
  @IsString()
  review_attachment?: string;
}
