import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AcknowledgeRecordDto {
  @ApiProperty({
    description: '是否确认收到资助',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  acknowledged: boolean = true;

  @ApiPropertyOptional({
    description: '确认备注',
    example: '已收到资助金，非常感谢',
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}
