import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 用户注册接口
   * POST /api/users
   */
  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.register(createUserDto);
  }

  /**
   * 获取指定用户详情（包含关联角色）
   * GET /api/users/:id
   * 该接口受 JWT 保护，只有登录用户才能访问
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  /**
   * 更新用户信息接口
   * PUT /api/users/:id
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  /**
   * 删除用户接口（仅限管理员操作，权限判断可在 Guard 中实现）
   * DELETE /api/users/:id
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id);
    return { message: '用户删除成功' };
  }

  /**
   * 为指定用户分配角色
   * POST /api/users/:id/roles
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/roles')
  async assignRoles(
    @Param('id') id: number,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return await this.userService.assignRoles(id, assignRoleDto);
  }
}
