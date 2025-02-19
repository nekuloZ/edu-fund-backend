import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FundApplicationService } from './fund-application.service';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { UpdateFundApplicationDto } from './dto/update-fund-application.dto';
import { QueryFundApplicationDto } from './dto/query-fund-application.dto';
import { CreateApplicationAttachmentDto } from '../application-attachment/dto/create-application-attachment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/applications')
@UseGuards(JwtAuthGuard) // 保护所有接口
export class FundApplicationController {
  constructor(private readonly applicationService: FundApplicationService) {}

  /**
   * 项目申请提交
   * POST /api/applications
   * 可选：附件信息可通过请求体中附件字段上传
   */
  @Post()
  async createApplication(
    @Body() createDto: CreateFundApplicationDto,
    // 可通过附件字段传入附件数据（如果前端将附件与申请一起提交）
    @Body('attachments') attachments?: CreateApplicationAttachmentDto[],
  ) {
    return await this.applicationService.createApplication(
      createDto,
      attachments,
    );
  }

  /**
   * 申请修改与补充
   * PUT /api/applications/:id
   */
  @Put(':id')
  async updateApplication(
    @Param('id') id: number,
    @Body() updateDto: UpdateFundApplicationDto,
  ) {
    return await this.applicationService.updateApplication(id, updateDto);
  }

  /**
   * 申请查询与跟踪
   * GET /api/applications
   * 支持关键字搜索、状态过滤、项目类型筛选、排序和分页
   */
  @Get()
  async queryApplications(@Query() queryDto: QueryFundApplicationDto) {
    return await this.applicationService.queryApplications(queryDto);
  }

  /**
   * 申请详情获取
   * GET /api/applications/:id
   * 根据申请ID获取详细信息，包括附件和审核记录
   */
  @Get(':id')
  async getApplicationById(@Param('id') id: number) {
    return await this.applicationService.getApplicationById(id);
  }

  /**
   * 申请删除
   * DELETE /api/applications/:id
   * 删除申请时，同时清理附件和审核记录
   */
  @Delete(':id')
  async deleteApplication(@Param('id') id: number) {
    await this.applicationService.deleteApplication(id);
    return { message: '申请删除成功' };
  }
}
