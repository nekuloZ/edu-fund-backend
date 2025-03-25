import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('api/front/users')
export class FrontUserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 用户注册
   */
  @Post('register')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '用户注册',
    description: '创建新的用户账号',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  /**
   * 获取个人信息
   */
  @Get('profile')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取个人信息',
    description: '获取当前登录用户的个人资料',
  })
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<User> {
    return await this.userService.findById(req.user.userId);
  }

  /**
   * 更新个人信息
   */
  @Put('profile')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '更新个人信息',
    description: '更新当前登录用户的个人资料',
  })
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(req.user.userId, updateUserDto);
  }
}
