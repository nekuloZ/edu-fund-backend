import { Controller, Post, Body, Param, Put, Get, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FundApplicationService } from './fund-application.service';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fund-application')
export class FundApplicationController {
  constructor(private readonly fundApplicationService: FundApplicationService) {}

  // 创建基金项目申请
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createFundApplicationDto: CreateFundApplicationDto, @Param('userId') userId: number) {
    return this.fundApplicationService.createFundApplication(createFundApplicationDto, userId);
  }

  // 上传附件
  @UseGuards(JwtAuthGuard)
  @Post(':applicationId/attachment')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(@Param('applicationId') applicationId: number, @UploadedFile() file: Express.Multer.File) {
    const uploadAttachmentDto: UploadAttachmentDto = { file_path: file.path, file_type: file.mimetype };
    return this.fundApplicationService.uploadAttachment(applicationId, uploadAttachmentDto);
  }

  // 查询基金申请
  @Get(':applicationId')
  async get(@Param('applicationId') applicationId: number) {
    return this.fundApplicationService.getFundApplication(applicationId);
  }

  // 更新基金项目申请
  @Put(':application
