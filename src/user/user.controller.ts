import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard'; // 引入权限验证守卫
import { Roles } from '../auth/roles.decorator'; // 引入角色装饰器

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  // 获取所有用户（仅管理员可以访问）
  @Roles('admin') // 只有 admin 角色才可以访问
  @UseGuards(JwtAuthGuard, RolesGuard) // 使用 JWT 认证和角色守卫
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  // 更新用户信息（管理员和财务人员可以访问）
  @Roles('admin', 'finance') // 允许 admin 和 finance 角色访问
  @UseGuards(JwtAuthGuard, RolesGuard) // 使用 JWT 认证和角色守卫
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateUserDto>,
  ) {
    return this.userService.updateUser(id, updateData);
  }
}
