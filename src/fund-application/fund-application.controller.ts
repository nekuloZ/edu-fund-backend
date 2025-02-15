import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundApplicationService } from './fund-application.service';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { UpdateFundApplicationDto } from './dto/update-fund-application.dto';

@Controller('fund-application')
export class FundApplicationController {
  constructor(private readonly fundApplicationService: FundApplicationService) {}

  @Post()
  create(@Body() createFundApplicationDto: CreateFundApplicationDto) {
    return this.fundApplicationService.create(createFundApplicationDto);
  }

  @Get()
  findAll() {
    return this.fundApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundApplicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundApplicationDto: UpdateFundApplicationDto) {
    return this.fundApplicationService.update(+id, updateFundApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundApplicationService.remove(+id);
  }
}
