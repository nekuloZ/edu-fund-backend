import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisbursementRecordService } from './disbursement-record.service';
import { CreateDisbursementRecordDto } from './dto/create-disbursement-record.dto';
import { UpdateDisbursementRecordDto } from './dto/update-disbursement-record.dto';

@Controller('disbursement-record')
export class DisbursementRecordController {
  constructor(private readonly disbursementRecordService: DisbursementRecordService) {}

  @Post()
  create(@Body() createDisbursementRecordDto: CreateDisbursementRecordDto) {
    return this.disbursementRecordService.create(createDisbursementRecordDto);
  }

  @Get()
  findAll() {
    return this.disbursementRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disbursementRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDisbursementRecordDto: UpdateDisbursementRecordDto) {
    return this.disbursementRecordService.update(+id, updateDisbursementRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disbursementRecordService.remove(+id);
  }
}
