import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewLogService } from './review-log.service';
import { CreateReviewLogDto } from './dto/create-review-log.dto';
import { UpdateReviewLogDto } from './dto/update-review-log.dto';

@Controller('review-log')
export class ReviewLogController {
  constructor(private readonly reviewLogService: ReviewLogService) {}

  @Post()
  create(@Body() createReviewLogDto: CreateReviewLogDto) {
    return this.reviewLogService.create(createReviewLogDto);
  }

  @Get()
  findAll() {
    return this.reviewLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewLogDto: UpdateReviewLogDto) {
    return this.reviewLogService.update(+id, updateReviewLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewLogService.remove(+id);
  }
}
