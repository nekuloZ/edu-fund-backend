import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * 前台接口 - 获取组织列表
   */
  @Get('api/front/organization/list')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取组织列表',
    description: '获取所有公开的组织列表，支持分页和筛选',
  })
  @ApiResponse({
    status: 200,
    description: '获取组织列表成功',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              name: { type: 'string', example: '希望工程基金会' },
              description: {
                type: 'string',
                example: '致力于改善贫困地区教育条件的公益组织',
              },
              logo: { type: 'string', example: 'https://example.com/logo.png' },
              website: { type: 'string', example: 'https://www.hope.org' },
              contactEmail: { type: 'string', example: 'contact@hope.org' },
              contactPhone: { type: 'string', example: '400-123-4567' },
              address: { type: 'string', example: '北京市朝阳区xxx街道xxx号' },
              status: { type: 'string', example: 'active' },
              operator: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  username: { type: 'string', example: 'admin' },
                },
              },
              createdAt: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 15 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 2 },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/front/organizations')
  async findAll() {
    return await this.organizationService.findAll();
  }

  /**
   * 前台接口 - 获取组织详情
   */
  @Get('api/front/organization/detail/:id')
  @ApiTags('前台接口')
  @ApiOperation({
    summary: '获取组织详情',
    description: '根据组织ID获取组织的详细信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取组织详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '希望工程基金会' },
        description: {
          type: 'string',
          example: '致力于改善贫困地区教育条件的公益组织',
        },
        logo: { type: 'string', example: 'https://example.com/logo.png' },
        website: { type: 'string', example: 'https://www.hope.org' },
        contactEmail: { type: 'string', example: 'contact@hope.org' },
        contactPhone: { type: 'string', example: '400-123-4567' },
        address: { type: 'string', example: '北京市朝阳区xxx街道xxx号' },
        status: { type: 'string', example: 'active' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@example.com' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '组织不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的组织' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '组织ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/front/organization/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.organizationService.findOne(id);
  }

  /**
   * 后台接口 - 创建组织
   */
  @ApiOperation({
    summary: '创建组织',
    description: '创建新的组织，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 201,
    description: '创建组织成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '希望工程基金会' },
        description: {
          type: 'string',
          example: '致力于改善贫困地区教育条件的公益组织',
        },
        logo: { type: 'string', example: 'https://example.com/logo.png' },
        website: { type: 'string', example: 'https://www.hope.org' },
        contactEmail: { type: 'string', example: 'contact@hope.org' },
        contactPhone: { type: 'string', example: '400-123-4567' },
        address: { type: 'string', example: '北京市朝阳区xxx街道xxx号' },
        status: { type: 'string', example: 'active' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '组织名称不能为空' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/organization')
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req,
  ) {
    return await this.organizationService.create(
      createOrganizationDto,
      req.user.id,
    );
  }

  /**
   * 后台接口 - 获取组织列表
   */
  @ApiOperation({
    summary: '获取组织列表',
    description: '获取所有组织列表，支持分页和查询',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取组织列表成功',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              name: { type: 'string', example: '希望工程基金会' },
              description: {
                type: 'string',
                example: '致力于改善贫困地区教育条件的公益组织',
              },
              logo: { type: 'string', example: 'https://example.com/logo.png' },
              website: { type: 'string', example: 'https://www.hope.org' },
              contactEmail: { type: 'string', example: 'contact@hope.org' },
              contactPhone: { type: 'string', example: '400-123-4567' },
              address: { type: 'string', example: '北京市朝阳区xxx街道xxx号' },
              status: { type: 'string', example: 'active' },
              operator: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  username: { type: 'string', example: 'admin' },
                },
              },
              createdAt: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 15 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 2 },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/organizations')
  async findAllAdmin() {
    return await this.organizationService.findAll();
  }

  /**
   * 后台接口 - 获取组织详情
   */
  @ApiOperation({
    summary: '获取组织详情',
    description: '获取指定组织的详细信息',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取组织详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '希望工程基金会' },
        description: {
          type: 'string',
          example: '致力于改善贫困地区教育条件的公益组织',
        },
        logo: { type: 'string', example: 'https://example.com/logo.png' },
        website: { type: 'string', example: 'https://www.hope.org' },
        contactEmail: { type: 'string', example: 'contact@hope.org' },
        contactPhone: { type: 'string', example: '400-123-4567' },
        address: { type: 'string', example: '北京市朝阳区xxx街道xxx号' },
        status: { type: 'string', example: 'active' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@example.com' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '组织不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的组织' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '组织ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/organization/:id')
  async findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return await this.organizationService.findOne(id);
  }

  /**
   * 后台接口 - 更新组织
   */
  @ApiOperation({
    summary: '更新组织',
    description: '更新组织信息，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '更新组织信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        name: { type: 'string', example: '希望工程基金会' },
        description: {
          type: 'string',
          example: '致力于改善贫困地区教育条件的公益组织',
        },
        logo: { type: 'string', example: 'https://example.com/logo.png' },
        website: { type: 'string', example: 'https://www.hope.org' },
        contactEmail: { type: 'string', example: 'contact@hope.org' },
        contactPhone: { type: 'string', example: '400-123-4567' },
        address: { type: 'string', example: '北京市朝阳区xxx街道xxx号' },
        status: { type: 'string', example: 'active' },
        operator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'admin' },
          },
        },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '没有权限更新此组织',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '您没有权限更新此组织' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '组织ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/organization/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Request() req,
  ) {
    const organization = await this.organizationService.findOne(id);

    if (
      organization.operator &&
      organization.operator.id !== req.user.id &&
      !req.user.roles.includes('admin')
    ) {
      throw new ForbiddenException('您没有权限更新此组织');
    }

    return await this.organizationService.update(id, updateOrganizationDto);
  }

  /**
   * 后台接口 - 删除组织
   */
  @ApiOperation({
    summary: '删除组织',
    description: '删除指定的组织，需要管理员权限',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '删除组织成功',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: '组织删除成功' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '组织ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('api/admin/organization/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.organizationService.remove(id);
  }

  @ApiOperation({
    summary: '获取组织统计',
    description: '获取组织相关的统计数据，包括总数、类型分布等',
  })
  @ApiTags('后台接口')
  @ApiResponse({
    status: 200,
    description: '获取组织统计数据成功',
    schema: {
      type: 'object',
      properties: {
        totalOrganizations: { type: 'number', example: 50 },
        activeOrganizations: { type: 'number', example: 45 },
        inactiveOrganizations: { type: 'number', example: 5 },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/organization/statistics')
  async getStatistics() {
    return await this.organizationService.getStatistics();
  }
}
