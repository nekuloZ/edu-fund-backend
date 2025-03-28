import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { QueryDonationDto } from './dto/query-donation.dto';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { PeriodicDonationDto } from './dto/periodic-donation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('捐赠管理-前台和后台')
@Controller()
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @ApiOperation({
    summary: '提交捐赠',
    description: '用户提交一次性或定期捐赠，支持匿名捐赠和留言',
  })
  @ApiResponse({
    status: 201,
    description: '捐赠提交成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        amount: { type: 'number', example: 100 },
        donationType: { type: 'string', example: 'onetime' },
        message: { type: 'string', example: '希望能帮助到有需要的人' },
        isAnonymous: { type: 'boolean', example: false },
        donorName: { type: 'string', example: '张三' },
        donorEmail: { type: 'string', example: 'donor@example.com' },
        donorPhone: { type: 'string', example: '13800138000' },
        project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            title: { type: 'string', example: '希望小学建设项目' },
          },
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误或项目不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '未登录用户必须提供姓名和邮箱' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @Post('api/front/donation/submit')
  async submitDonation(
    @Body() createDonationDto: CreateDonationDto,
    @Request() req,
  ) {
    // 检查请求中是否有用户信息（如果用户已登录）
    const userId = req.user?.userId;
    return await this.donationService.create(createDonationDto, userId);
  }

  @ApiOperation({
    summary: '获取捐赠记录',
    description: '获取当前登录用户的捐赠记录，支持分页和多种查询条件',
  })
  @ApiResponse({
    status: 200,
    description: '获取捐赠记录成功',
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
              amount: { type: 'number', example: 100 },
              donationType: { type: 'string', example: 'monthly' },
              message: { type: 'string', example: '希望能帮助到有需要的人' },
              isAnonymous: { type: 'boolean', example: false },
              project: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  title: { type: 'string', example: '希望小学建设项目' },
                },
              },
              createdAt: {
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
  @UseGuards(JwtAuthGuard)
  @Get('api/front/donation/record')
  async getDonationRecord(@Query() queryDto: QueryDonationDto, @Request() req) {
    return await this.donationService.findByUser(req.user.userId, queryDto);
  }

  @ApiOperation({
    summary: '生成捐赠证书',
    description: '根据捐赠记录生成电子证书，记录捐赠人的爱心行为',
  })
  @ApiResponse({
    status: 201,
    description: '证书生成成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '证书生成成功' },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
            },
            certificateNumber: {
              type: 'string',
              example: 'CERT-20240325-00001',
            },
            recipientName: { type: 'string', example: '张三' },
            donationId: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            donationAmount: { type: 'number', example: 1000 },
            projectName: { type: 'string', example: '希望小学建设项目' },
            isDownloaded: { type: 'boolean', example: false },
            createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误或捐赠记录不存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '捐赠记录不存在' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @Post('api/front/donation/certificate')
  async generateCertificate(@Body() generateDto: GenerateCertificateDto) {
    return await this.donationService.generateCertificate(generateDto);
  }

  @ApiOperation({
    summary: '设置定期捐赠',
    description: '设置定期捐赠计划，支持按月、按季度或按年捐赠',
  })
  @ApiResponse({
    status: 201,
    description: '定期捐赠设置成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '定期捐赠设置成功' },
        donation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            amount: { type: 'number', example: 100 },
            donationType: { type: 'string', example: 'monthly' },
            message: { type: 'string', example: '希望能持续帮助需要的人' },
            isAnonymous: { type: 'boolean', example: false },
            project: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                },
                title: { type: 'string', example: '希望小学建设项目' },
              },
            },
            createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '用户或项目不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为123的用户' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('api/front/donation/periodic')
  async setPeriodicDonation(
    @Body() periodicDto: PeriodicDonationDto,
    @Request() req,
  ) {
    return await this.donationService.setPeriodicDonation(
      periodicDto,
      req.user.userId,
    );
  }

  @ApiOperation({
    summary: '获取项目捐赠统计',
    description:
      '获取指定项目的捐赠统计信息，包括总金额、捐赠人数和最近捐赠记录',
  })
  @ApiResponse({
    status: 200,
    description: '获取项目捐赠统计成功',
    schema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
        projectTitle: { type: 'string', example: '希望小学建设项目' },
        totalDonations: { type: 'number', example: 156 },
        totalAmount: { type: 'number', example: 15600 },
        targetAmount: { type: 'number', example: 20000 },
        progress: { type: 'number', example: 78 },
        recentDonations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              amount: { type: 'number', example: 100 },
              date: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
              donorName: { type: 'string', example: '张三' },
              message: { type: 'string', example: '希望能帮助到有需要的人' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '项目不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的项目' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'projectId',
    description: '项目ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @Get('api/front/donation/stats/:projectId')
  async getProjectStats(@Param('projectId') projectId: string) {
    return await this.donationService.getProjectDonationStats(projectId);
  }

  @ApiOperation({
    summary: '获取捐款列表(管理员)',
    description: '管理员获取所有捐款记录，支持多种查询条件和分页',
  })
  @ApiResponse({
    status: 200,
    description: '获取捐款列表成功',
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
              amount: { type: 'number', example: 100 },
              donationType: { type: 'string', example: 'monthly' },
              message: { type: 'string', example: '希望能帮助到有需要的人' },
              isAnonymous: { type: 'boolean', example: false },
              donor: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  username: { type: 'string', example: 'zhangsan' },
                },
                nullable: true,
              },
              donorName: { type: 'string', example: '张三' },
              donorEmail: { type: 'string', example: 'donor@example.com' },
              donorPhone: { type: 'string', example: '13800138000' },
              project: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                  },
                  title: { type: 'string', example: '希望小学建设项目' },
                },
              },
              createdAt: {
                type: 'string',
                example: '2024-03-25T09:30:45.123Z',
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 156 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 16 },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/donation/list')
  async getAdminDonationList(@Query() queryDto: QueryDonationDto) {
    return await this.donationService.findAll(queryDto);
  }

  @ApiOperation({
    summary: '获取捐款详情(管理员)',
    description:
      '管理员获取指定捐款记录的详细信息，包括捐赠者信息和关联项目信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取捐款详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        amount: { type: 'number', example: 100 },
        donationType: { type: 'string', example: 'monthly' },
        message: { type: 'string', example: '希望能帮助到有需要的人' },
        isAnonymous: { type: 'boolean', example: false },
        donor: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            username: { type: 'string', example: 'zhangsan' },
            email: { type: 'string', example: 'zhangsan@example.com' },
            phone: { type: 'string', example: '13800138000' },
          },
          nullable: true,
        },
        donorName: { type: 'string', example: '张三' },
        donorEmail: { type: 'string', example: 'donor@example.com' },
        donorPhone: { type: 'string', example: '13800138000' },
        project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            },
            title: { type: 'string', example: '希望小学建设项目' },
            description: { type: 'string', example: '为贫困地区建设希望小学' },
            targetAmount: { type: 'number', example: 20000 },
            raisedAmount: { type: 'number', example: 15600 },
            progress: { type: 'number', example: 78 },
          },
        },
        certificate: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
            },
            certificateNumber: {
              type: 'string',
              example: 'CERT-20240325-00001',
            },
            recipientName: { type: 'string', example: '张三' },
            isDownloaded: { type: 'boolean', example: false },
            createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
          },
          nullable: true,
        },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '捐款记录不存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: '未找到ID为xxx的捐赠记录' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '捐款记录ID',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/donation/:id')
  async getAdminDonationDetail(@Param('id') id: string) {
    return await this.donationService.findOne(id);
  }

  @ApiOperation({
    summary: '导出捐款记录',
    description: '管理员导出捐款记录，支持按条件筛选，导出格式为JSON',
  })
  @ApiResponse({
    status: 200,
    description: '导出捐款记录成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              projectName: { type: 'string', example: '希望小学建设项目' },
              donorName: { type: 'string', example: '张三' },
              donorEmail: { type: 'string', example: 'donor@example.com' },
              amount: { type: 'number', example: 100 },
              donationType: { type: 'string', example: 'monthly' },
              date: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
              hasCertificate: { type: 'string', example: '是' },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/donation/export')
  async exportDonations(@Query() queryDto: QueryDonationDto) {
    // 获取捐赠记录
    const { items } = await this.donationService.findAll({
      ...queryDto,
      limit: 1000, // 导出更多记录
    });

    // 转换为导出格式
    const exportData = items.map((donation) => ({
      id: donation.id,
      projectName: donation.project.title,
      donorName: donation.isAnonymous
        ? '匿名捐赠者'
        : donation.donor
          ? donation.donor.username
          : donation.donorName,
      donorEmail: donation.isAnonymous ? '匿名' : donation.donorEmail,
      amount: donation.amount,
      donationType: donation.donationType,
      date: donation.createdAt,
      hasCertificate: donation.isCertificateGenerated ? '是' : '否',
    }));

    return {
      success: true,
      data: exportData,
      timestamp: new Date(),
    };
  }

  @ApiOperation({
    summary: '获取捐款分析',
    description: '管理员获取捐款相关的统计数据，包括总额、项目分布和月度趋势',
  })
  @ApiResponse({
    status: 200,
    description: '获取捐款分析成功',
    schema: {
      type: 'object',
      properties: {
        totalDonation: { type: 'number', example: 15600 },
        projectStats: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              projectId: {
                type: 'string',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              projectTitle: { type: 'string', example: '希望小学建设项目' },
              amount: { type: 'number', example: 8000 },
              count: { type: 'number', example: 80 },
            },
          },
        },
        monthlyStats: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              month: { type: 'string', example: '2024-03' },
              amount: { type: 'number', example: 1200 },
              count: { type: 'number', example: 12 },
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/donation/analysis')
  async getDonationAnalysis() {
    // 获取捐赠总额
    const totalResult = await this.donationService['donationRepository']
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .getRawOne();

    // 获取各项目捐赠统计
    const projectStats = await this.donationService['donationRepository']
      .createQueryBuilder('donation')
      .leftJoin('donation.project', 'project')
      .select('project.id', 'projectId')
      .addSelect('project.title', 'projectTitle')
      .addSelect('SUM(donation.amount)', 'amount')
      .addSelect('COUNT(donation.id)', 'count')
      .groupBy('project.id')
      .addGroupBy('project.title')
      .orderBy('amount', 'DESC')
      .getRawMany();

    // 获取各月份捐赠统计（最近12个月）
    const monthlyStats = await this.donationService['donationRepository']
      .createQueryBuilder('donation')
      .select("DATE_FORMAT(donation.createdAt, '%Y-%m')", 'month')
      .addSelect('SUM(donation.amount)', 'amount')
      .addSelect('COUNT(donation.id)', 'count')
      .where('donation.createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      totalDonation: totalResult.total || 0,
      projectStats,
      monthlyStats,
    };
  }

  @ApiOperation({
    summary: '管理证书',
    description: '管理员查看所有已生成的捐赠证书信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取证书列表成功',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          donationId: {
            type: 'string',
            example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          certificateId: {
            type: 'string',
            example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
          },
          certificateNumber: { type: 'string', example: 'CERT-20240325-00001' },
          recipientName: { type: 'string', example: '张三' },
          amount: { type: 'number', example: 1000 },
          projectTitle: { type: 'string', example: '希望小学建设项目' },
          donorName: { type: 'string', example: '张三' },
          issueDate: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/donation/certificates')
  async getCertificates() {
    // 获取所有生成过证书的捐赠记录
    const donations = await this.donationService['donationRepository'].find({
      where: { isCertificateGenerated: true },
      relations: ['certificate', 'project', 'donor'],
    });

    return donations.map((donation) => ({
      donationId: donation.id,
      certificateId: donation.certificate.id,
      certificateNumber: donation.certificate.certificateNumber,
      recipientName: donation.certificate.recipientName,
      amount: donation.amount,
      projectTitle: donation.project.title,
      donorName: donation.isAnonymous
        ? '匿名捐赠者'
        : donation.donor
          ? donation.donor.username
          : donation.donorName,
      issueDate: donation.certificate.issueDate,
    }));
  }
}
