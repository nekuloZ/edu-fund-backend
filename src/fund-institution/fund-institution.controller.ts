import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundInstitutionService } from './fund-institution.service';
import { CreateFundInstitutionDto } from './dto/create-fund-institution.dto';
import { UpdateFundInstitutionDto } from './dto/update-fund-institution.dto';

@Controller('fund-institution')
export class FundInstitutionController {
  constructor(private readonly fundInstitutionService: FundInstitutionService) {}

  @Post()
  create(@Body() createFundInstitutionDto: CreateFundInstitutionDto) {
    return this.fundInstitutionService.create(createFundInstitutionDto);
  }

  @Get()
  findAll() {
    return this.fundInstitutionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundInstitutionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundInstitutionDto: UpdateFundInstitutionDto) {
    return this.fundInstitutionService.update(+id, updateFundInstitutionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundInstitutionService.remove(+id);
  }
}
