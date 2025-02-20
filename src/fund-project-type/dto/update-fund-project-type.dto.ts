import { IsOptional, IsString } from 'class-validator';

export class UpdateFundProjectTypeDto {
  @IsOptional()
  @IsString({ message: '项目类型名称必须是字符串' })
  projectTypeName?: string;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  description?: string;
}
