import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  // 用户名不能为空
  @IsString()
  @IsNotEmpty()
  username: string;

  // 密码不能为空
  @IsString()
  @IsNotEmpty()
  password: string;
}
