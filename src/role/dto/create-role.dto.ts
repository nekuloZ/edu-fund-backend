import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 用于创建新角色，必须提供角色名称，
 * 描述字段可选。
 */
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role_name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
