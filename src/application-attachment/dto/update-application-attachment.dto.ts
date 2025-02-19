import { IsString, IsOptional } from 'class-validator';

/**
 * 用于更新项目申请附件信息的数据结构
 */
export class UpdateApplicationAttachmentDto {
  // 更新后的文件存储路径或URL
  @IsString()
  @IsOptional()
  file_path?: string;

  // 更新后的文件类型，如 pdf、jpg 等
  @IsString()
  @IsOptional()
  file_type?: string;
}
