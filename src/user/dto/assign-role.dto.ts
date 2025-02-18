import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class AssignRoleDto {
  // 传入的角色ID数组不能为空，且每个角色ID必须是整数
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  roleIds: number[];
}
