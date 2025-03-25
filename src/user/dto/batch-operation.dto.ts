import { IsArray, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchOperationDto {
  @ApiProperty({
    description: '用户ID数组',
    type: [String],
    example: [
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      '5d576b2e-3a1c-4c21-a911-bbce73ae49e7',
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @IsUUID(4, { each: true })
  ids: string[];
}

export class BatchStatusUpdateDto extends BatchOperationDto {
  @ApiProperty({
    description: '用户状态',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
