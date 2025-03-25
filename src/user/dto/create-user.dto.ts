import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'john_doe',
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

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
    description: '用户状态',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean({ message: '状态必须是布尔值' })
  @IsOptional()
  isActive?: boolean;
}
