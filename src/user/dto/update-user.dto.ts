import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: '真实姓名',
    example: '张三',
    required: false,
  })
  @IsString({ message: '真实姓名必须是字符串' })
  @IsOptional()
  realName?: string;

  @ApiProperty({
    description: '电子邮箱',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: '手机号码',
    example: '13800138000',
    required: false,
  })
  @IsString({ message: '手机号码必须是字符串' })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString({ message: '头像URL必须是字符串' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: '密码',
    example: 'newpassword123',
    minLength: 6,
    required: false,
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: '用户状态',
    example: true,
    required: false,
  })
  @IsBoolean({ message: '状态必须是布尔值' })
  @IsOptional()
  isActive?: boolean;
}
