import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DisbursementRecordService } from './disbursement-record.service';
import { CreateDisbursementRecordDto } from './dto/create-disbursement-record.dto';
import { UpdateDisbursementRecordDto } from './dto/update-disbursement-record.dto';
import { QueryDisbursementRecordDto } from './dto/query-disbursement-record.dto';

@Controller('disbursement-records')
export class DisbursementRecordController {
  constructor(
    private readonly disbursementRecordService: DisbursementRecordService,
  ) {}

  // POST /api/disbursement-records
  // 创建新的拨款记录
  @Post()
  async create(@Body() createDto: CreateDisbursementRecordDto) {
    return await this.disbursementRecordService.create(createDto);
  }

  // GET /api/disbursement-records
  // 查询拨款记录列表，支持多条件筛选、排序和分页
  @Get()
  async findAll(@Query() queryDto: QueryDisbursementRecordDto) {
    return await this.disbursementRecordService.findAll(queryDto);
  }

  // GET /api/disbursement-records/:id
  // 根据拨款记录 ID 获取详细信息
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.disbursementRecordService.findOne(id);
  }

  // PUT /api/disbursement-records/:id
  // 更新拨款记录（例如修改金额、状态、备注等）
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateDisbursementRecordDto,
  ) {
    return await this.disbursementRecordService.update(id, updateDto);
  }

  // DELETE /api/disbursement-records/:id
  // 删除拨款记录，删除前进行必要的校验
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.disbursementRecordService.remove(id);
  }
}
