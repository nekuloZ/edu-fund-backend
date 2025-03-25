import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({
    description: '角色名称数组',
    type: [String],
    example: ['admin', 'editor', 'user'],
  })
  @IsArray({ message: '角色必须是数组' })
  @ArrayNotEmpty({ message: '角色数组不能为空' })
  @IsString({ each: true, message: '角色名称必须是字符串' })
  roles: string[];
}
