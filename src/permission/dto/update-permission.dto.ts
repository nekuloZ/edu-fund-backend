import { IsString, IsOptional } from 'class-validator';

/**
 * 用于更新权限信息，
 * 权限名称和描述均为可选字段。
 */
export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  permission_name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
