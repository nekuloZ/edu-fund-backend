import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export enum ProjectType {
  PUBLIC_POOL = 'public_pool',
  SCHOLARSHIP = 'scholarship',
  GRANT = 'grant',
}

export class CreateFundApplicationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount_requested: number;

  @IsString()
  @IsNotEmpty()
  use_plan: string;

  @IsEnum(ProjectType)
  @IsNotEmpty()
  project_type: ProjectType;
}
