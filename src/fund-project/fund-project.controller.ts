import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundProjectService } from './fund-project.service';
import { CreateFundProjectDto } from './dto/create-fund-project.dto';
import { UpdateFundProjectDto } from './dto/update-fund-project.dto';

@Controller('fund-project')
export class FundProjectController {
  constructor(private readonly fundProjectService: FundProjectService) {}

  @Post()
  create(@Body() createFundProjectDto: CreateFundProjectDto) {
    return this.fundProjectService.create(createFundProjectDto);
  }

  @Get()
  findAll() {
    return this.fundProjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundProjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundProjectDto: UpdateFundProjectDto) {
    return this.fundProjectService.update(+id, updateFundProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundProjectService.remove(+id);
  }
}
