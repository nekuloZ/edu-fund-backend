import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  // 邮箱更新时需要符合邮箱格式
  @IsEmail()
  @IsOptional()
  email?: string;

  // 电话号码更新可选
  @IsString()
  @IsOptional()
  phone?: string;

  // 头像 URL 更新可选
  @IsString()
  @IsOptional()
  avatar?: string;

  // 若需要更新密码，也可以传入新密码（后续需要重新加密）
  @IsString()
  @IsOptional()
  password?: string;
}
