import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({
    description: '权限ID数组',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray({ message: '权限ID必须是数组' })
  @ArrayNotEmpty({ message: '权限ID数组不能为空' })
  @IsInt({ each: true, message: '权限ID必须是整数' })
  permissionIds: number[];
}
