import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFundProjectDto {
  @IsNotEmpty({ message: '项目名称不能为空' })
  @IsString({ message: '项目名称必须为字符串' })
  projectName: string; // 项目名称

  @IsNotEmpty({ message: '项目负责人不能为空' })
  @IsString({ message: '项目负责人必须为字符串' })
  projectLeader: string; // 项目负责人

  @IsNotEmpty({ message: '项目周期不能为空' })
  @IsString({ message: '项目周期必须为字符串' })
  projectPeriod: string; // 项目周期，可以是描述或具体时间范围

  @IsNotEmpty({ message: '预算不能为空' })
  @IsNumber({}, { message: '预算必须为数字' })
  budget: number; // 项目预算

  @IsNotEmpty({ message: '进度不能为空' })
  @IsString({ message: '进度必须为字符串' })
  progress: string; // 项目进度描述

  @IsOptional()
  @IsString({ message: '项目描述必须为字符串' })
  description?: string; // 项目详细描述
}
