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
import { FundProjectService } from './fund-project.service';
import { CreateFundProjectDto } from './dto/create-fund-project.dto';
import { UpdateFundProjectDto } from './dto/update-fund-project.dto';
import { QueryFundProjectDto } from './dto/query-fund-project.dto';

@Controller('fund-projects')
export class FundProjectController {
  constructor(private readonly fundProjectService: FundProjectService) {}

  // POST /api/fund-projects
  // 创建新的基金项目
  @Post()
  async create(@Body() createDto: CreateFundProjectDto) {
    return await this.fundProjectService.create(createDto);
  }

  // GET /api/fund-projects
  // 查询基金项目列表，支持关键字搜索、排序和分页
  @Get()
  async findAll(@Query() queryDto: QueryFundProjectDto) {
    return await this.fundProjectService.findAll(queryDto);
  }

  // GET /api/fund-projects/:id
  // 根据项目 ID 获取基金项目详情
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.fundProjectService.findOne(id);
  }

  // PUT /api/fund-projects/:id
  // 更新基金项目信息
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateFundProjectDto,
  ) {
    return await this.fundProjectService.update(id, updateDto);
  }

  // DELETE /api/fund-projects/:id
  // 删除基金项目，删除前会校验是否存在关联的基金项目申请
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.fundProjectService.remove(id);
  }
}
