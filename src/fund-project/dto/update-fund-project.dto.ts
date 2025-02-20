import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateFundProjectDto {
  @IsOptional()
  @IsString({ message: '项目名称必须为字符串' })
  projectName?: string; // 可更新的项目名称

  @IsOptional()
  @IsString({ message: '项目负责人必须为字符串' })
  projectLeader?: string; // 可更新的项目负责人

  @IsOptional()
  @IsString({ message: '项目周期必须为字符串' })
  projectPeriod?: string; // 可更新的项目周期

  @IsOptional()
  @IsNumber({}, { message: '预算必须为数字' })
  budget?: number; // 可更新的预算

  @IsOptional()
  @IsString({ message: '进度必须为字符串' })
  progress?: string; // 可更新的进度描述

  @IsOptional()
  @IsString({ message: '项目描述必须为字符串' })
  description?: string; // 可更新的项目详细描述
}
