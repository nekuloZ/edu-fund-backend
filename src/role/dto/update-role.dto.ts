import { IsString, IsOptional } from 'class-validator';

/**
 * 用于更新角色信息，
 * 角色名称和描述均为可选字段。
 */
export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  role_name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
