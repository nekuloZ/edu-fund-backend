import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
  ForbiddenException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentService } from './document.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Multer } from 'multer';

@ApiTags('document')
@Controller()
export class DocumentController {
  private readonly uploadDir = 'uploads/documents';

  constructor(private readonly documentService: DocumentService) {}

  // ---------- 前台接口 ----------

  @ApiOperation({
    summary: '获取文档列表',
    description: '获取公开的文档列表，支持分页、排序和过滤',
  })
  @ApiResponse({
    status: 200,
    description: '获取文档列表成功',
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
                example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
              },
              name: { type: 'string', example: '2023年度财务报告' },
              url: {
                type: 'string',
                example: '/uploads/documents/financial-report-2023.pdf',
              },
              type: { type: 'string', example: 'application/pdf' },
              size: { type: 'number', example: 1024000 },
              category: { type: 'string', example: 'annual-report' },
              year: { type: 'number', example: 2023 },
              downloadCount: { type: 'number', example: 123 },
              isPublic: { type: 'boolean', example: true },
              createdAt: {
                type: 'string',
                example: '2023-12-31T15:30:45.123Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-05T10:15:20.456Z',
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 45 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'category',
    description: '文档类别',
    required: false,
    example: 'annual-report',
  })
  @ApiQuery({
    name: 'year',
    description: '文档年份',
    required: false,
    example: 2023,
  })
  @Get('api/front/document/list')
  async findAllForFront(@Query() queryDto: QueryDocumentDto) {
    // 对于前端，只返回公开文档
    queryDto.isPublic = true;
    return this.documentService.findAll(queryDto);
  }

  @ApiOperation({
    summary: '获取文档详情',
    description: '根据ID获取公开文档的详细信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取文档详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '7854a5c4-83c2-4d04-b7d9-0123456789ab' },
        name: { type: 'string', example: '2023年度财务报告' },
        url: {
          type: 'string',
          example: '/uploads/documents/financial-report-2023.pdf',
        },
        type: { type: 'string', example: 'application/pdf' },
        size: { type: 'number', example: 1024000 },
        category: { type: 'string', example: 'annual-report' },
        year: { type: 'number', example: 2023 },
        downloadCount: { type: 'number', example: 123 },
        isPublic: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2023-12-31T15:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-01-05T10:15:20.456Z' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '文档不公开',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '该文档不公开' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '文档ID',
    type: 'string',
    example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
  })
  @Get('api/front/document/:id')
  async findOneForFront(@Param('id', ParseUUIDPipe) id: string) {
    const document = await this.documentService.findOne(id);
    // 检查文档是否公开
    if (!document.isPublic) {
      throw new ForbiddenException('该文档不公开');
    }
    return document;
  }

  @ApiOperation({
    summary: '下载文档',
    description: '根据ID下载公开文档，并增加文档的下载计数',
  })
  @ApiResponse({
    status: 200,
    description: '下载文档成功',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '文档不公开',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: '该文档不公开' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '文件不存在' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '文档ID',
    type: 'string',
    example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
  })
  @Get('api/front/document/:id/download')
  async downloadDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const document = await this.documentService.findOne(id);

    // 检查文档是否公开
    if (!document.isPublic) {
      throw new ForbiddenException('该文档不公开');
    }

    // 解析文件名
    const filename = document.url.split('/').pop();
    const filePath = path.join(this.uploadDir, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: '文件不存在',
      });
    }

    // 增加下载计数
    await this.documentService.incrementDownloadCount(id);

    // 发送文件
    return res.download(filePath, document.name + path.extname(filename));
  }

  @ApiOperation({
    summary: '获取年度报告列表',
    description: '获取所有公开的年度报告文档列表，按年份倒序排序',
  })
  @ApiResponse({
    status: 200,
    description: '获取年度报告列表成功',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
          },
          name: { type: 'string', example: '2023年度报告' },
          url: {
            type: 'string',
            example: '/uploads/documents/annual-report-2023.pdf',
          },
          type: { type: 'string', example: 'application/pdf' },
          size: { type: 'number', example: 1024000 },
          category: { type: 'string', example: 'annual-report' },
          year: { type: 'number', example: 2023 },
          downloadCount: { type: 'number', example: 123 },
          isPublic: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2023-12-31T15:30:45.123Z' },
          updatedAt: { type: 'string', example: '2024-01-05T10:15:20.456Z' },
        },
      },
    },
  })
  @Get('api/front/transparency/annual-report')
  async getAnnualReports() {
    return this.documentService.getAnnualReports();
  }

  @ApiOperation({
    summary: '获取项目文档列表',
    description: '根据项目ID获取与该项目关联的所有公开文档',
  })
  @ApiResponse({
    status: 200,
    description: '获取项目文档列表成功',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
          },
          name: { type: 'string', example: '项目实施计划' },
          url: {
            type: 'string',
            example: '/uploads/documents/project-plan-2023.pdf',
          },
          type: { type: 'string', example: 'application/pdf' },
          size: { type: 'number', example: 824000 },
          category: { type: 'string', example: 'project-document' },
          year: { type: 'number', example: 2023 },
          downloadCount: { type: 'number', example: 56 },
          isPublic: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2023-12-31T15:30:45.123Z' },
          updatedAt: { type: 'string', example: '2024-01-05T10:15:20.456Z' },
        },
      },
    },
  })
  @ApiParam({
    name: 'projectId',
    description: '项目ID',
    type: 'string',
    example: '8954a5c4-83c2-4d04-b7d9-0123456789cd',
  })
  @Get('api/front/project/:projectId/documents')
  async getProjectDocuments(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.documentService.getProjectDocuments(projectId);
  }

  // ---------- 后台接口 ----------

  @ApiOperation({
    summary: '上传文档',
    description: '管理员上传新文档，支持指定文档类别、年份和关联项目等信息',
  })
  @ApiResponse({
    status: 201,
    description: '上传文档成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '7854a5c4-83c2-4d04-b7d9-0123456789ab' },
        name: { type: 'string', example: '2023年度财务报告' },
        url: {
          type: 'string',
          example: '/uploads/documents/financial-report-2023.pdf',
        },
        type: { type: 'string', example: 'application/pdf' },
        size: { type: 'number', example: 1024000 },
        category: { type: 'string', example: 'annual-report' },
        year: { type: 'number', example: 2023 },
        downloadCount: { type: 'number', example: 0 },
        isPublic: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T09:30:45.123Z' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('api/admin/document/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '要上传的文档文件',
        },
        name: {
          type: 'string',
          example: '2023年度报告',
          description: '文档名称',
        },
        category: {
          type: 'string',
          example: 'annual-report',
          description: '文档类别',
          enum: [
            'annual-report',
            'financial-statement',
            'project-document',
            'other',
          ],
        },
        year: {
          type: 'number',
          example: 2023,
          description: '文档年份',
        },
        projectId: {
          type: 'string',
          example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
          description: '关联项目ID',
        },
        isPublic: {
          type: 'boolean',
          example: true,
          description: '是否公开',
        },
      },
    },
  })
  async uploadDocument(
    @UploadedFile() file: Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    return this.documentService.upload(file, uploadDocumentDto);
  }

  @ApiOperation({
    summary: '获取文档列表(管理员)',
    description: '管理员获取所有文档列表，包括非公开文档，支持分页、排序和过滤',
  })
  @ApiResponse({
    status: 200,
    description: '获取文档列表成功',
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
                example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
              },
              name: { type: 'string', example: '2023年度财务报告（内部版）' },
              url: {
                type: 'string',
                example:
                  '/uploads/documents/financial-report-2023-internal.pdf',
              },
              type: { type: 'string', example: 'application/pdf' },
              size: { type: 'number', example: 1240000 },
              category: { type: 'string', example: 'financial-statement' },
              year: { type: 'number', example: 2023 },
              downloadCount: { type: 'number', example: 5 },
              isPublic: { type: 'boolean', example: false },
              createdAt: {
                type: 'string',
                example: '2023-12-31T15:30:45.123Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-05T10:15:20.456Z',
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 68 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 7 },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'category',
    description: '文档类别',
    required: false,
    example: 'financial-statement',
  })
  @ApiQuery({
    name: 'year',
    description: '文档年份',
    required: false,
    example: 2023,
  })
  @ApiQuery({
    name: 'isPublic',
    description: '是否公开',
    required: false,
    example: false,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('api/admin/document/list')
  async findAllForAdmin(@Query() queryDto: QueryDocumentDto) {
    return this.documentService.findAll(queryDto);
  }

  @ApiOperation({
    summary: '获取文档详情(管理员)',
    description: '管理员根据ID获取文档的详细信息，包括非公开文档',
  })
  @ApiResponse({
    status: 200,
    description: '获取文档详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '7854a5c4-83c2-4d04-b7d9-0123456789ab' },
        name: { type: 'string', example: '2023年度财务报告（内部版）' },
        url: {
          type: 'string',
          example: '/uploads/documents/financial-report-2023-internal.pdf',
        },
        type: { type: 'string', example: 'application/pdf' },
        size: { type: 'number', example: 1240000 },
        category: { type: 'string', example: 'financial-statement' },
        year: { type: 'number', example: 2023 },
        project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '8954a5c4-83c2-4d04-b7d9-0123456789cd',
            },
            name: { type: 'string', example: '乡村教育支持计划' },
          },
          nullable: true,
        },
        downloadCount: { type: 'number', example: 5 },
        isPublic: { type: 'boolean', example: false },
        createdAt: { type: 'string', example: '2023-12-31T15:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-01-05T10:15:20.456Z' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '文档ID',
    type: 'string',
    example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('api/admin/document/:id')
  async findOneForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentService.findOne(id);
  }

  @ApiOperation({
    summary: '更新文档信息',
    description:
      '管理员更新文档的基本信息，如名称、类别、年份、关联项目和公开状态等',
  })
  @ApiResponse({
    status: 200,
    description: '更新文档信息成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '7854a5c4-83c2-4d04-b7d9-0123456789ab' },
        name: { type: 'string', example: '2023年度财务报告（修订版）' },
        url: {
          type: 'string',
          example: '/uploads/documents/financial-report-2023-internal.pdf',
        },
        type: { type: 'string', example: 'application/pdf' },
        size: { type: 'number', example: 1240000 },
        category: { type: 'string', example: 'financial-statement' },
        year: { type: 'number', example: 2023 },
        downloadCount: { type: 'number', example: 5 },
        isPublic: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2023-12-31T15:30:45.123Z' },
        updatedAt: { type: 'string', example: '2024-03-25T11:45:20.456Z' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '文档ID',
    type: 'string',
    example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
  })
  @ApiBody({
    type: UpdateDocumentDto,
    description: '文档更新信息',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('api/admin/document/:id')
  async updateDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @ApiOperation({
    summary: '删除文档',
    description: '管理员删除指定ID的文档及其对应的文件',
  })
  @ApiResponse({
    status: 200,
    description: '删除文档成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '文档删除成功' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: '文档ID',
    type: 'string',
    example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('api/admin/document/:id')
  async deleteDocument(@Param('id', ParseUUIDPipe) id: string) {
    await this.documentService.remove(id);
    return { message: '文档删除成功' };
  }

  @ApiOperation({
    summary: '获取文档统计信息',
    description: '管理员获取文档的统计信息，包括总数、各类别数量、下载次数等',
  })
  @ApiResponse({
    status: 200,
    description: '获取文档统计信息成功',
    schema: {
      type: 'object',
      properties: {
        totalDocuments: { type: 'number', example: 68 },
        totalDownloads: { type: 'number', example: 1245 },
        categoryStats: {
          type: 'object',
          properties: {
            'annual-report': { type: 'number', example: 15 },
            'financial-statement': { type: 'number', example: 24 },
            'project-document': { type: 'number', example: 25 },
            other: { type: 'number', example: 4 },
          },
        },
        publicDocuments: { type: 'number', example: 52 },
        privateDocuments: { type: 'number', example: 16 },
        mostDownloadedDocuments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '7854a5c4-83c2-4d04-b7d9-0123456789ab',
              },
              name: { type: 'string', example: '2023年度财务报告' },
              downloadCount: { type: 'number', example: 123 },
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('api/admin/document/statistics')
  async getStatistics() {
    return this.documentService.getStatistics();
  }
}
