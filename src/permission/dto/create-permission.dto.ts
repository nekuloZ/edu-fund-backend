import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 用于创建新权限项，必须提供权限名称，
 * 描述字段可选。
 */
export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  permission_name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
