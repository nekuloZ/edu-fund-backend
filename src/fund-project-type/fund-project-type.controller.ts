import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundProjectTypeService } from './fund-project-type.service';
import { CreateFundProjectTypeDto } from './dto/create-fund-project-type.dto';
import { UpdateFundProjectTypeDto } from './dto/update-fund-project-type.dto';

@Controller('fund-project-type')
export class FundProjectTypeController {
  constructor(private readonly fundProjectTypeService: FundProjectTypeService) {}

  @Post()
  create(@Body() createFundProjectTypeDto: CreateFundProjectTypeDto) {
    return this.fundProjectTypeService.create(createFundProjectTypeDto);
  }

  @Get()
  findAll() {
    return this.fundProjectTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundProjectTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundProjectTypeDto: UpdateFundProjectTypeDto) {
    return this.fundProjectTypeService.update(+id, updateFundProjectTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundProjectTypeService.remove(+id);
  }
}
