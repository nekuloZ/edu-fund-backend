import { Injectable } from '@nestjs/common';
import { CreateApplicationReviewDto } from './dto/create-application-review.dto';
import { UpdateApplicationReviewDto } from './dto/update-application-review.dto';

@Injectable()
export class ApplicationReviewsService {
  create(createApplicationReviewDto: CreateApplicationReviewDto) {
    return 'This action adds a new applicationReview';
  }

  findAll() {
    return `This action returns all applicationReviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicationReview`;
  }

  update(id: number, updateApplicationReviewDto: UpdateApplicationReviewDto) {
    return `This action updates a #${id} applicationReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicationReview`;
  }
}
