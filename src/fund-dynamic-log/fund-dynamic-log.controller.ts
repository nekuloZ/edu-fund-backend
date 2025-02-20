import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FundDynamicLogService } from './fund-dynamic-log.service';
import { CreateFundDynamicLogDto } from './dto/create-fund-dynamic-log.dto';
import { UpdateFundDynamicLogDto } from './dto/update-fund-dynamic-log.dto';
import { QueryFundDynamicLogDto } from './dto/query-fund-dynamic-log.dto';

@Controller('fund-dynamic-logs')
export class FundDynamicLogController {
  constructor(private readonly fundDynamicLogService: FundDynamicLogService) {}

  // POST /api/fund-dynamic-logs
  // 创建资金动态日志记录
  @Post()
  async create(@Body() createDto: CreateFundDynamicLogDto) {
    return await this.fundDynamicLogService.create(createDto);
  }

  // PUT /api/fund-dynamic-logs/:id
  // 更新资金动态日志记录
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateFundDynamicLogDto,
  ) {
    return await this.fundDynamicLogService.update(id, updateDto);
  }

  // GET /api/fund-dynamic-logs
  // 查询资金动态日志列表，支持多条件筛选、分页和排序
  @Get()
  async findAll(@Query() queryDto: QueryFundDynamicLogDto) {
    return await this.fundDynamicLogService.findAll(queryDto);
  }

  // GET /api/fund-dynamic-logs/:id
  // 根据日志ID获取资金动态日志详情
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.fundDynamicLogService.findOne(id);
  }

  // DELETE /api/fund-dynamic-logs/:id
  // 删除资金动态日志记录
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.fundDynamicLogService.remove(id);
  }
}
