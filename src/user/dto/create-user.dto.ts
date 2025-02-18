import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  // 用户名不能为空
  @IsString()
  @IsNotEmpty()
  username: string;

  // 密码不能为空，实际业务中还可以添加密码强度校验
  @IsString()
  @IsNotEmpty()
  password: string;

  // 邮箱可选，并且需要符合邮箱格式
  @IsEmail()
  @IsOptional()
  email?: string;

  // 电话号码可选
  @IsString()
  @IsOptional()
  phone?: string;
}
