import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAttachmentDto {
  @IsNotEmpty()
  @IsString()
  file_path: string; // 文件路径

  @IsString()
  file_type: string; // 文件类型
}
