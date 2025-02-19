import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProjectType } from './create-fund-application.dto';

export class UpdateFundApplicationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  amount_requested?: number;

  @IsString()
  @IsOptional()
  use_plan?: string;

  @IsEnum(ProjectType)
  @IsOptional()
  project_type?: ProjectType;
}
