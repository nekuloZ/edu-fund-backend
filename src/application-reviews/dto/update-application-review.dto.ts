import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationReviewDto } from './create-application-review.dto';

export class UpdateApplicationReviewDto extends PartialType(CreateApplicationReviewDto) {}
