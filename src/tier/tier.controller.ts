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
import { TierService } from './tier.service';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';
import { QueryTierDto } from './dto/query-tier.dto';

@Controller('tiers')
export class TierController {
  constructor(private readonly tierService: TierService) {}

  // POST /api/tiers
  // 创建新的奖学金档次，调用 Service 的 create 方法
  @Post()
  async create(@Body() createDto: CreateTierDto) {
    return await this.tierService.create(createDto);
  }

  // GET /api/tiers
  // 查询档次列表，支持关键字搜索、分页和排序
  @Get()
  async findAll(@Query() queryDto: QueryTierDto) {
    return await this.tierService.findAll(queryDto);
  }

  // GET /api/tiers/:id
  // 根据档次 ID 获取档次详情
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.tierService.findOne(id);
  }

  // PUT /api/tiers/:id
  // 更新已有档次信息
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateTierDto) {
    return await this.tierService.update(id, updateDto);
  }

  // DELETE /api/tiers/:id
  // 删除档次，调用 Service 的 remove 方法
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.tierService.remove(id);
  }
}
