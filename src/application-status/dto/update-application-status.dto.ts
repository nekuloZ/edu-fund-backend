import { IsOptional, IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  // 可更新的状态名称
  @IsOptional()
  @IsString()
  statusName?: string;

  // 可更新的状态描述
  @IsOptional()
  @IsString()
  description?: string;
}
