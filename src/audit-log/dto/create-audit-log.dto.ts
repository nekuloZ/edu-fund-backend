import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiProperty({
    description: '操作类型',
    example: 'create',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: '实体类型',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  entity: string;

  @ApiPropertyOptional({
    description: '实体ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityId?: string;

  @ApiPropertyOptional({
    description: '修改前的值',
    example: { name: '张三', email: 'old@example.com' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  oldValues?: object;

  @ApiPropertyOptional({
    description: '修改后的值',
    example: { name: '张三', email: 'new@example.com' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  newValues?: object;

  @ApiPropertyOptional({
    description: 'IP地址',
    example: '192.168.1.1',
    required: false,
  })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiPropertyOptional({
    description: '用户代理',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({
    description: '用户ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
