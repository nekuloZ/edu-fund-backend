import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateFundApplicationDto {
  @IsNotEmpty()
  @IsString()
  title: string; // 项目标题

  @IsOptional()
  @IsString()
  description: string; // 项目详细描述

  @IsNotEmpty()
  @IsNumber()
  amount_requested: number; // 申请金额

  @IsOptional()
  @IsString()
  use_plan: string; // 资金使用计划

  @IsNotEmpty()
  @IsEnum(['public_pool', 'other'])
  project_type: 'public_pool' | 'other'; // 项目类型

  @IsNotEmpty()
  @IsEnum([
    'submitted',
    'pending_review',
    'approved',
    'rejected',
    'needs_revision',
  ])
  status:
    | 'submitted'
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'needs_revision'; // 项目状态
}
