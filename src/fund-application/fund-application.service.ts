import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundApplication } from './entities/fund-application.entity';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { ApplicationAttachment } from '../application-attachment/entities/application-attachment.entity';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';

@Injectable()
export class FundApplicationService {
  constructor(
    @InjectRepository(FundApplication)
    private fundApplicationRepository: Repository<FundApplication>,
    @InjectRepository(ApplicationAttachment)
    private attachmentRepository: Repository<ApplicationAttachment>,
  ) {}

  // 创建基金项目申请
  async createFundApplication(
    createFundApplicationDto: CreateFundApplicationDto,
    applicantId: number,
  ): Promise<FundApplication> {
    const {
      title,
      description,
      amount_requested,
      use_plan,
      project_type,
      status,
    } = createFundApplicationDto;

    const fundApplication = this.fundApplicationRepository.create({
      applicant: { user_id: applicantId }, // 假设 applicantId 是传递的
      title,
      description,
      amount_requested,
      use_plan,
      project_type,
      status,
    });

    return await this.fundApplicationRepository.save(fundApplication);
  }

  // 上传附件
  async uploadAttachment(
    applicationId: number,
    uploadAttachmentDto: UploadAttachmentDto,
  ): Promise<ApplicationAttachment> {
    const { file_path, file_type } = uploadAttachmentDto;

    const attachment = this.attachmentRepository.create({
      application: { application_id: applicationId },
      file_path,
      file_type,
    });

    return await this.attachmentRepository.save(attachment);
  }

  // 查询基金申请
  async getFundApplication(applicationId: number): Promise<FundApplication> {
    return await this.fundApplicationRepository.findOne({
      where: { application_id: applicationId },
      relations: ['applicant', 'institution'],
    });
  }

  // 更新基金项目申请
  async updateFundApplication(
    applicationId: number,
    updateData: Partial<CreateFundApplicationDto>,
  ): Promise<FundApplication> {
    const application =
      await this.fundApplicationRepository.findOne(applicationId);
    if (!application) {
      throw new Error('Fund application not found');
    }

    Object.assign(application, updateData);
    return await this.fundApplicationRepository.save(application);
  }
}
