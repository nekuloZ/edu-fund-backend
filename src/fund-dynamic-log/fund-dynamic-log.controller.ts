import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundDynamicLogService } from './fund-dynamic-log.service';
import { CreateFundDynamicLogDto } from './dto/create-fund-dynamic-log.dto';
import { UpdateFundDynamicLogDto } from './dto/update-fund-dynamic-log.dto';

@Controller('fund-dynamic-log')
export class FundDynamicLogController {
  constructor(private readonly fundDynamicLogService: FundDynamicLogService) {}

  @Post()
  create(@Body() createFundDynamicLogDto: CreateFundDynamicLogDto) {
    return this.fundDynamicLogService.create(createFundDynamicLogDto);
  }

  @Get()
  findAll() {
    return this.fundDynamicLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundDynamicLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundDynamicLogDto: UpdateFundDynamicLogDto) {
    return this.fundDynamicLogService.update(+id, updateFundDynamicLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundDynamicLogService.remove(+id);
  }
}
