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
import { FundProjectTypeService } from './fund-project-type.service';
import { CreateFundProjectTypeDto } from './dto/create-fund-project-type.dto';
import { UpdateFundProjectTypeDto } from './dto/update-fund-project-type.dto';
import { QueryFundProjectTypeDto } from './dto/query-fund-project-type.dto';

@Controller('fund-project-types')
export class FundProjectTypeController {
  constructor(private readonly projectTypeService: FundProjectTypeService) {}

  // POST /api/fund-project-types
  // 创建新的项目类型，调用 Service 的 create 方法
  @Post()
  async create(@Body() createDto: CreateFundProjectTypeDto) {
    return await this.projectTypeService.create(createDto);
  }

  // GET /api/fund-project-types
  // 查询项目类型列表，支持关键字搜索、排序和分页
  @Get()
  async findAll(@Query() queryDto: QueryFundProjectTypeDto) {
    return await this.projectTypeService.findAll(queryDto);
  }

  // GET /api/fund-project-types/:id
  // 根据项目类型 ID 获取详情，调用 Service 的 findOne 方法
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.projectTypeService.findOne(id);
  }

  // PUT /api/fund-project-types/:id
  // 更新项目类型信息，调用 Service 的 update 方法
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateFundProjectTypeDto,
  ) {
    return await this.projectTypeService.update(id, updateDto);
  }

  // DELETE /api/fund-project-types/:id
  // 删除项目类型，调用 Service 的 remove 方法，在删除前会校验是否存在关联项目
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.projectTypeService.remove(id);
  }
}
