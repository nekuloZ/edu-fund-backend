import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFundApplicationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amountRequested: number;

  @IsNotEmpty()
  @IsString()
  usePlan: string;

  @IsNotEmpty()
  @IsNumber()
  projectTypeId: number;

  @IsOptional()
  @IsNumber()
  applicantId?: number;

  @IsOptional()
  @IsNumber()
  institutionId?: number;
}
