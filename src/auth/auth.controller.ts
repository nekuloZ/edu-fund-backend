import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 前台接口 - 用户登录
   */
  @Post('api/front/auth/login')
  @ApiTags('认证模块-前台')
  @ApiOperation({
    summary: '用户登录',
    description: '用户登录并获取访问令牌',
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
            email: { type: 'string', example: 'zhangsan@example.com' },
            role: { type: 'string', example: 'user' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '登录失败',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: '用户名或密码错误' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 前台接口 - 用户注册
   */
  @Post('api/front/auth/register')
  @ApiTags('认证模块-前台')
  @ApiOperation({
    summary: '用户注册',
    description: '创建新的用户账号',
  })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        username: { type: 'string', example: 'zhangsan' },
        email: { type: 'string', example: 'zhangsan@example.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '注册失败',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '用户名已存在' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 前台接口 - 获取当前用户信息
   */
  @Get('api/front/auth/profile')
  @ApiTags('认证模块-前台')
  @ApiOperation({
    summary: '获取当前用户信息',
    description: '获取当前登录用户的详细信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        username: { type: 'string', example: 'zhangsan' },
        email: { type: 'string', example: 'zhangsan@example.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  /**
   * 后台接口 - 管理员登录
   */
  @Post('api/admin/auth/login')
  @ApiTags('认证模块-后台')
  @ApiOperation({
    summary: '管理员登录',
    description: '管理员登录并获取访问令牌',
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@example.com' },
            role: { type: 'string', example: 'admin' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '登录失败',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: '用户名或密码错误' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 后台接口 - 创建管理员
   */
  @Post('api/admin/auth/register')
  @ApiTags('认证模块-后台')
  @ApiOperation({
    summary: '创建管理员',
    description: '创建新的管理员账号，需要超级管理员权限',
  })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        username: { type: 'string', example: 'admin' },
        email: { type: 'string', example: 'admin@example.com' },
        role: { type: 'string', example: 'admin' },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限创建管理员',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限创建管理员账号' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async createAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 刷新令牌接口，使用刷新令牌获取新的访问令牌
   */
  @Post('api/admin/auth/refresh-token')
  @ApiOperation({
    summary: '刷新访问令牌',
    description: '使用刷新令牌获取新的访问令牌，避免用户重新登录',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: '刷新令牌信息',
    examples: {
      example1: {
        summary: '标准刷新',
        description: '使用刷新令牌获取新的访问令牌',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '刷新成功，返回新令牌',
    schema: {
      example: {
        success: true,
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: 3600,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '刷新令牌无效或已过期',
    schema: {
      example: {
        success: false,
        message: '刷新令牌无效或已过期',
      },
    },
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * 退出登录接口，使令牌失效
   * 需要JWT认证
   */
  @UseGuards(JwtAuthGuard)
  @Post('api/admin/auth/logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '退出登录',
    description: '使当前用户的访问令牌和刷新令牌失效，安全退出系统',
  })
  @ApiResponse({
    status: 200,
    description: '退出成功',
    schema: {
      example: {
        success: true,
        message: '退出成功',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        success: false,
        message: '未授权访问',
      },
    },
  })
  async logout(@Headers('authorization') auth: string) {
    // 从请求头中提取刷新令牌，格式为: Bearer xxx
    const refreshToken = auth?.split(' ')[1];
    if (!refreshToken) {
      return { success: false, message: '未提供令牌' };
    }

    return await this.authService.logout(refreshToken);
  }

  /**
   * 测试JWT认证
   */
  @Get('api/admin/auth/test-jwt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '测试JWT认证',
    description: '用于测试JWT认证是否正常工作',
  })
  @ApiResponse({
    status: 200,
    description: '认证成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '认证成功' },
        user: { type: 'object' },
      },
    },
  })
  testJwt(@Request() req) {
    return {
      message: '认证成功',
      user: req.user,
    };
  }

  /**
   * JWT诊断工具
   */
  @Post('api/admin/auth/jwt-diagnostic')
  @ApiOperation({
    summary: 'JWT诊断工具',
    description: '用于生成和验证JWT令牌，帮助调试认证问题',
  })
  jwtDiagnostic(@Body() payload: any) {
    const secret = this.authService.getJwtSecret();
    const token = this.authService.generateToken(payload);
    let verifyResult;
    try {
      verifyResult = this.authService.verifyToken(token);
    } catch (error) {
      verifyResult = { error: error.message };
    }
    return {
      secret: `${secret.substring(0, 3)}...${secret.substring(secret.length - 3)}`,
      payload,
      token,
      tokenVerification: verifyResult,
    };
  }
}
