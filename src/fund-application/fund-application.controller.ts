import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { FundApplicationService } from './fund-application.service';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { CreateApplicationAttachmentDto } from '../application-attachment/dto/create-application-attachment.dto';
import { UpdateFundApplicationDto } from './dto/update-fund-application.dto';
import { QueryFundApplicationDto } from './dto/query-fund-application.dto';

@Controller('fund-application')
export class FundApplicationController {
  constructor(
    private readonly fundApplicationService: FundApplicationService,
  ) {}

  // 申请提交接口：POST /fund-application
  @Post()
  async create(@Body() createDto: CreateFundApplicationDto) {
    return await this.fundApplicationService.create(createDto);
  }

  // 附件上传接口：POST /fund-application/attachment
  @Post('attachment')
  async createAttachment(
    @Body() createAttachmentDto: CreateApplicationAttachmentDto,
  ) {
    return await this.fundApplicationService.createAttachment(
      createAttachmentDto,
    );
  }

  // 申请修改接口：PUT /fund-application/:id
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateFundApplicationDto,
  ) {
    return await this.fundApplicationService.update(id, updateDto);
  }

  // 申请查询接口：GET /fund-application?keyword=&status=&page=&limit=
  @Get()
  async findAll(@Query() queryDto: QueryFundApplicationDto) {
    return await this.fundApplicationService.findAll(queryDto);
  }

  // 申请详情获取接口：GET /fund-application/:id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.fundApplicationService.findOne(id);
  }

  // 申请删除接口：DELETE /fund-application/:id
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.fundApplicationService.remove(id);
  }

  // 申请状态更新接口：PATCH /fund-application/:id/status
  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return await this.fundApplicationService.updateStatus(id, status);
  }
}
