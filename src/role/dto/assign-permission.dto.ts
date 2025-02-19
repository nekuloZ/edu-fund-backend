import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

/**
 * 用于为角色分配权限，
 * 接收一个权限ID数组，不能为空。
 */
export class AssignPermissionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionIds: number[];
}
