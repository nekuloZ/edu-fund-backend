import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateApplicationStatusDto {
  // 状态名称，如 submitted、pending_review、approved、rejected、needs_revision 等
  @IsNotEmpty()
  @IsString()
  statusName: string;

  // 状态描述，用于详细说明该状态的业务含义
  @IsOptional()
  @IsString()
  description?: string;
}
