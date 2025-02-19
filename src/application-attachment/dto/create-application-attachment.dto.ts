import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

/**
 * 用于上传项目申请附件的数据结构
 */
export class CreateApplicationAttachmentDto {
  // 附件文件的存储路径或URL，必填
  @IsString()
  @IsNotEmpty()
  file_path: string;

  // 文件类型，例如 pdf、jpg 等，非必填
  @IsString()
  @IsOptional()
  file_type?: string;

  // 如果需要在请求体中传递关联的项目申请ID，则可以包含此字段
  @IsOptional()
  @IsNumber()
  application_id?: number;
}
