import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApplicationStatusService } from './application-status.service';
import { CreateApplicationStatusDto } from './dto/create-application-status.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { QueryApplicationStatusDto } from './dto/query-application-status.dto';

@Controller('application-status')
export class ApplicationStatusController {
  constructor(
    private readonly applicationStatusService: ApplicationStatusService,
  ) {}

  // 创建申请状态：POST /api/application-status
  @Post()
  async create(@Body() createDto: CreateApplicationStatusDto) {
    return await this.applicationStatusService.create(createDto);
  }

  // 查询申请状态列表：GET /api/application-status?keyword=&page=&limit=
  @Get()
  async findAll(@Query() queryDto: QueryApplicationStatusDto) {
    return await this.applicationStatusService.findAll(queryDto);
  }

  // 查询申请状态详情：GET /api/application-status/:id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.applicationStatusService.findOne(id);
  }

  // 更新申请状态：PUT /api/application-status/:id
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateApplicationStatusDto,
  ) {
    return await this.applicationStatusService.update(id, updateDto);
  }

  // 删除申请状态：DELETE /api/application-status/:id
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.applicationStatusService.remove(id);
  }
}
