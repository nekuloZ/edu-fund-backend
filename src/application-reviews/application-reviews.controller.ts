import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationReviewsService } from './application-reviews.service';
import { CreateApplicationReviewDto } from './dto/create-application-review.dto';
import { UpdateApplicationReviewDto } from './dto/update-application-review.dto';

@Controller('application-reviews')
export class ApplicationReviewsController {
  constructor(private readonly applicationReviewsService: ApplicationReviewsService) {}

  @Post()
  create(@Body() createApplicationReviewDto: CreateApplicationReviewDto) {
    return this.applicationReviewsService.create(createApplicationReviewDto);
  }

  @Get()
  findAll() {
    return this.applicationReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationReviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationReviewDto: UpdateApplicationReviewDto) {
    return this.applicationReviewsService.update(+id, updateApplicationReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationReviewsService.remove(+id);
  }
}
