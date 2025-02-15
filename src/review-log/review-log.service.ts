import { Injectable } from '@nestjs/common';
import { CreateReviewLogDto } from './dto/create-review-log.dto';
import { UpdateReviewLogDto } from './dto/update-review-log.dto';

@Injectable()
export class ReviewLogService {
  create(createReviewLogDto: CreateReviewLogDto) {
    return 'This action adds a new reviewLog';
  }

  findAll() {
    return `This action returns all reviewLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reviewLog`;
  }

  update(id: number, updateReviewLogDto: UpdateReviewLogDto) {
    return `This action updates a #${id} reviewLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} reviewLog`;
  }
}
