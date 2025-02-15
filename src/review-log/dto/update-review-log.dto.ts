import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewLogDto } from './create-review-log.dto';

export class UpdateReviewLogDto extends PartialType(CreateReviewLogDto) {}
