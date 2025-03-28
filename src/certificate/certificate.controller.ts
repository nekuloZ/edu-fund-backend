import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { QueryCertificateDto } from './dto/query-certificate.dto';

@ApiTags('证书管理-前台和后台')
@Controller()
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  // ------------ 前台接口 ------------

  @ApiOperation({
    summary: '生成捐赠证书',
    description: '根据捐赠记录生成电子证书，记录捐赠人的爱心行为',
  })
  @ApiBody({
    type: CreateCertificateDto,
    description: '证书创建信息',
    examples: {
      example1: {
        summary: '标准证书创建',
        description: '创建与捐赠记录关联的证书',
        value: {
          donationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          recipientName: '张三',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '证书生成成功',
    schema: {
      example: {
        success: true,
        message: '证书生成成功',
        data: {
          id: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
          certificateNumber: 'CERT-20231225-00001',
          recipientName: '张三',
          donationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          donationAmount: 1000,
          projectName: '希望小学建设项目',
          isDownloaded: false,
          createdAt: '2023-12-25T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误或捐赠记录不存在',
    schema: {
      example: {
        success: false,
        message: '捐赠记录不存在',
        error: 'Bad Request',
      },
    },
  })
  @Post('api/front/certificates')
  async createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
    return await this.certificateService.create(createCertificateDto);
  }

  @ApiOperation({
    summary: '获取证书详情',
    description: '根据证书ID获取证书的详细信息，包括关联的捐赠记录',
  })
  @ApiParam({
    name: 'id',
    description: '证书ID',
    type: String,
    format: 'uuid',
    example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
  })
  @ApiResponse({
    status: 200,
    description: '获取证书详情成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
          certificateNumber: 'CERT-20231225-00001',
          recipientName: '张三',
          donationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          donationAmount: 1000,
          donationDate: '2023-12-20T10:15:30.000Z',
          projectName: '希望小学建设项目',
          projectId: 'a17bc10b-58cc-4372-a567-0e02b2c3d789',
          fileUrl: 'https://example.com/certificates/cert-12345.pdf',
          isDownloaded: false,
          createdAt: '2023-12-25T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '证书不存在',
    schema: {
      example: {
        success: false,
        message: '证书不存在',
      },
    },
  })
  @Get('api/front/certificates/:id')
  async getCertificate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.certificateService.findOne(id);
  }

  @ApiOperation({
    summary: '验证证书有效性',
    description: '根据证书编号验证证书的真实性和有效性，用于第三方核验',
  })
  @ApiParam({
    name: 'certificateNumber',
    description: '证书编号',
    type: String,
    example: 'CERT-20231225-00001',
  })
  @ApiResponse({
    status: 200,
    description: '验证成功，返回证书信息',
    schema: {
      example: {
        success: true,
        isValid: true,
        data: {
          certificateNumber: 'CERT-20231225-00001',
          recipientName: '张三',
          donationAmount: 1000,
          donationDate: '2023-12-20T10:15:30.000Z',
          projectName: '希望小学建设项目',
          createdAt: '2023-12-25T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '证书编号无效',
    schema: {
      example: {
        success: false,
        isValid: false,
        message: '证书编号无效或不存在',
      },
    },
  })
  @Get('api/front/certificates/verify/:certificateNumber')
  async verifyCertificate(
    @Param('certificateNumber') certificateNumber: string,
  ) {
    return await this.certificateService.verifyCertificate(certificateNumber);
  }

  @ApiOperation({
    summary: '下载证书',
    description: '根据证书ID下载证书文件，并将证书标记为已下载状态',
  })
  @ApiParam({
    name: 'id',
    description: '证书ID',
    type: String,
    format: 'uuid',
    example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
  })
  @ApiResponse({
    status: 200,
    description: '返回证书文件链接',
    schema: {
      example: {
        fileUrl: 'https://example.com/certificates/cert-12345.pdf',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '证书不存在',
    schema: {
      example: {
        success: false,
        message: '证书不存在',
      },
    },
  })
  @Post('api/front/certificates/:id/download')
  @HttpCode(HttpStatus.OK)
  async downloadCertificate(@Param('id', ParseUUIDPipe) id: string) {
    // 先生成证书文件
    const { fileUrl } =
      await this.certificateService.generateCertificateFile(id);
    // 更新下载状态
    await this.certificateService.markAsDownloaded(id);
    return { fileUrl };
  }

  // ------------ 后台接口 ------------

  @ApiOperation({
    summary: '管理员获取证书列表',
    description: '管理员获取系统中所有证书的列表，支持多种筛选条件和分页',
  })
  @ApiQuery({
    name: 'recipientName',
    description: '证书接收人姓名',
    required: false,
    type: String,
    example: '张三',
  })
  @ApiQuery({
    name: 'certificateNumber',
    description: '证书编号',
    required: false,
    type: String,
    example: 'CERT-20231225-00001',
  })
  @ApiQuery({
    name: 'startDate',
    description: '开始日期',
    required: false,
    type: Date,
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: '结束日期',
    required: false,
    type: Date,
    example: '2023-12-31',
  })
  @ApiResponse({
    status: 200,
    description: '获取证书列表成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
            certificateNumber: 'CERT-20231225-00001',
            recipientName: '张三',
            donationAmount: 1000,
            projectName: '希望小学建设项目',
            isDownloaded: true,
            createdAt: '2023-12-25T08:30:00.000Z',
          },
          {
            id: 'f58bd20c-69dd-5483-b678-1f13c3d234',
            certificateNumber: 'CERT-20231226-00002',
            recipientName: '李四',
            donationAmount: 2000,
            projectName: '贫困学生助学金项目',
            isDownloaded: false,
            createdAt: '2023-12-26T14:20:00.000Z',
          },
        ],
        total: 45,
        page: 1,
        limit: 10,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/certificates')
  async getAllCertificates(@Query() queryDto: QueryCertificateDto) {
    return await this.certificateService.findAll(queryDto);
  }

  @ApiOperation({
    summary: '管理员获取证书详情',
    description:
      '管理员根据证书ID获取证书的详细信息，包括完整的捐赠和项目关联信息',
  })
  @ApiParam({
    name: 'id',
    description: '证书ID',
    type: String,
    format: 'uuid',
    example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
  })
  @ApiResponse({
    status: 200,
    description: '获取证书详情成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
          certificateNumber: 'CERT-20231225-00001',
          recipientName: '张三',
          donationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          donationAmount: 1000,
          donationDate: '2023-12-20T10:15:30.000Z',
          projectName: '希望小学建设项目',
          projectId: 'a17bc10b-58cc-4372-a567-0e02b2c3d789',
          fileUrl: 'https://example.com/certificates/cert-12345.pdf',
          isDownloaded: true,
          createdAt: '2023-12-25T08:30:00.000Z',
          updatedAt: '2023-12-26T09:15:00.000Z',
          donation: {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            amount: 1000,
            donorName: '张三',
            donorEmail: 'zhangsan@example.com',
            projectId: 'a17bc10b-58cc-4372-a567-0e02b2c3d789',
            createdAt: '2023-12-20T10:15:30.000Z',
          },
          project: {
            id: 'a17bc10b-58cc-4372-a567-0e02b2c3d789',
            title: '希望小学建设项目',
            status: 'active',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '证书不存在',
    schema: {
      example: {
        success: false,
        message: '证书不存在',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('api/admin/certificates/:id')
  async getAdminCertificate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.certificateService.findOne(id);
  }

  @ApiOperation({
    summary: '管理员更新证书信息',
    description: '管理员更新证书的基本信息，如接收人姓名、证书编号等',
  })
  @ApiParam({
    name: 'id',
    description: '证书ID',
    type: String,
    format: 'uuid',
    example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
  })
  @ApiBody({
    type: UpdateCertificateDto,
    description: '证书更新信息',
    examples: {
      example1: {
        summary: '更新证书接收人',
        description: '修改证书接收人姓名',
        value: {
          recipientName: '张三（更新）',
        },
      },
      example2: {
        summary: '标记下载状态',
        description: '修改证书下载状态',
        value: {
          isDownloaded: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '更新证书信息成功',
    schema: {
      example: {
        success: true,
        message: '证书更新成功',
        data: {
          id: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
          recipientName: '张三（更新）',
          certificateNumber: 'CERT-20231225-00001',
          updatedAt: '2023-12-27T11:20:30.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '证书不存在',
    schema: {
      example: {
        success: false,
        message: '证书不存在',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误',
    schema: {
      example: {
        success: false,
        message: '参数验证失败',
        errors: ['recipientName不能为空'],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('api/admin/certificates/:id')
  async updateCertificate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return await this.certificateService.update(id, updateCertificateDto);
  }

  @ApiOperation({
    summary: '管理员手动生成证书',
    description: '管理员手动为捐赠记录生成证书，适用于特殊情况下的证书补发',
  })
  @ApiBody({
    type: CreateCertificateDto,
    description: '证书创建信息',
    examples: {
      example1: {
        summary: '标准管理员创建证书',
        description: '管理员手动为捐赠记录创建证书',
        value: {
          donationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          recipientName: '张三',
          certificateNumber: 'CERT-ADMIN-00001',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '证书生成成功',
    schema: {
      example: {
        success: true,
        message: '证书生成成功',
        data: {
          id: 'g59ce30d-70ee-6594-c789-2g24d4e345',
          certificateNumber: 'CERT-ADMIN-00001',
          recipientName: '张三',
          donationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          donationAmount: 1000,
          projectName: '希望小学建设项目',
          isDownloaded: false,
          createdAt: '2023-12-27T15:40:00.000Z',
          createdBy: {
            id: '1',
            name: '管理员',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数错误或捐赠记录不存在',
    schema: {
      example: {
        success: false,
        message: '捐赠记录不存在',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/certificates')
  async adminCreateCertificate(
    @Body() createCertificateDto: CreateCertificateDto,
  ) {
    return await this.certificateService.create(createCertificateDto);
  }

  @ApiOperation({
    summary: '管理员重新生成证书文件',
    description:
      '管理员为已存在的证书重新生成证书文件，适用于证书模板变更或原文件丢失的情况',
  })
  @ApiParam({
    name: 'id',
    description: '证书ID',
    type: String,
    format: 'uuid',
    example: 'e47ac10b-58cc-4372-a567-0e02b2c3d123',
  })
  @ApiResponse({
    status: 200,
    description: '证书文件重新生成成功',
    schema: {
      example: {
        success: true,
        message: '证书文件重新生成成功',
        fileUrl: 'https://example.com/certificates/cert-12345-regenerated.pdf',
        updatedAt: '2023-12-27T16:45:30.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '证书不存在',
    schema: {
      example: {
        success: false,
        message: '证书不存在',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
    schema: {
      example: {
        statusCode: 401,
        message: '未授权访问',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/certificates/:id/regenerate')
  @HttpCode(HttpStatus.OK)
  async regenerateCertificate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.certificateService.generateCertificateFile(id);
  }
}
