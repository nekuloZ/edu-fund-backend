import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateApplicationAttachmentDto {
  @IsNotEmpty()
  @IsNumber()
  application_id: number;

  @IsNotEmpty()
  @IsString()
  file_path: string;

  @IsNotEmpty()
  @IsString()
  file_type: string;

  @IsOptional()
  upload_date?: Date;
}
