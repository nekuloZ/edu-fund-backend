import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Document } from './entities/document.entity';
import { Project, ProjectType } from '../project/entities/project.entity';
import { CreateDocumentDto, DocumentCategory } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class DocumentService {
  private readonly uploadDir = 'uploads/documents';

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {
    // 确保上传目录存在
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 创建文档记录
   */
  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = this.documentRepository.create(createDocumentDto);

    // 如果有关联项目，确保项目存在
    if (createDocumentDto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: createDocumentDto.projectId },
      });

      if (!project) {
        throw new NotFoundException(
          `项目ID为 ${createDocumentDto.projectId} 的项目不存在`,
        );
      }

      document.project = project;
    }

    return this.documentRepository.save(document);
  }

  /**
   * 上传文件并创建文档记录
   */
  async upload(
    file: {
      originalname: string;
      buffer: Buffer;
      mimetype: string;
      size: number;
    },
    uploadDto: UploadDocumentDto,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('文件不能为空');
    }

    try {
      // 生成唯一文件名
      const fileExtension = path.extname(file.originalname);
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      const filename = `${timestamp}-${randomString}${fileExtension}`;

      // 保存文件
      const filePath = path.join(this.uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);

      // 创建文档记录
      const createDocumentDto: CreateDocumentDto = {
        name: uploadDto.name,
        url: `/documents/${filename}`, // 文件访问相对路径
        type: file.mimetype,
        size: file.size,
        category: uploadDto.category,
        year: uploadDto.year,
        projectId: uploadDto.projectId,
        isPublic: uploadDto.isPublic,
      };

      // 保存记录到数据库
      return await this.create(createDocumentDto);
    } catch (error) {
      throw new BadRequestException(`文件上传失败: ${error.message}`);
    }
  }

  /**
   * 查询文档列表
   */
  async findAll(
    queryDto: QueryDocumentDto,
    isAdmin: boolean = false,
  ): Promise<{
    items: Document[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      category,
      year,
      projectId,
      keyword,
      isPublic,
      page = 1,
      limit = 10,
    } = queryDto;

    // 构建查询条件
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.project', 'project');

    // 如果不是管理员，只显示公开文档
    if (!isAdmin) {
      queryBuilder.andWhere('document.isPublic = :isPublic', {
        isPublic: true,
      });
    } else if (isPublic !== undefined) {
      queryBuilder.andWhere('document.isPublic = :isPublic', { isPublic });
    }

    // 按分类筛选
    if (category) {
      queryBuilder.andWhere('document.category = :category', { category });
    }

    // 按年份筛选
    if (year) {
      queryBuilder.andWhere('document.year = :year', { year });
    }

    // 按项目筛选
    if (projectId) {
      queryBuilder.andWhere('project.id = :projectId', { projectId });
    }

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(document.name LIKE :keyword OR project.title LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder
      .orderBy('document.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // 获取结果
    const items = await queryBuilder.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取单个文档
   */
  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!document) {
      throw new NotFoundException(`ID为${id}的文档不存在`);
    }

    return document;
  }

  /**
   * 更新文档信息
   */
  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document = await this.findOne(id);

    // 如果要更新项目关联，确保项目存在
    if (updateDocumentDto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: updateDocumentDto.projectId },
      });

      if (!project) {
        throw new NotFoundException(
          `项目ID为 ${updateDocumentDto.projectId} 的项目不存在`,
        );
      }

      document.project = project;
      delete updateDocumentDto.projectId;
    }

    // 更新文档属性
    const updatedDocument = Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(updatedDocument);
  }

  /**
   * 删除文档
   */
  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);

    try {
      // 删除物理文件
      const filePath = path.join(
        process.cwd(),
        document.url.replace(/^\//, ''),
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // 删除数据库记录
      await this.documentRepository.remove(document);
    } catch (error) {
      throw new BadRequestException(`文档删除失败: ${error.message}`);
    }
  }

  /**
   * 递增文档下载计数
   */
  async incrementDownloadCount(id: string): Promise<Document> {
    const document = await this.findOne(id);

    document.downloadCount += 1;

    return await this.documentRepository.save(document);
  }

  /**
   * 获取文档统计信息
   */
  async getStatistics(): Promise<{
    totalDocuments: number;
    publicDocuments: number;
    privateDocuments: number;
    totalDownloads: number;
    categoryStats: {
      category: string;
      count: number;
    }[];
    yearStats: {
      year: number;
      count: number;
    }[];
  }> {
    // 获取总文档数
    const totalDocuments = await this.documentRepository.count();

    // 获取公开文档数
    const publicDocuments = await this.documentRepository.count({
      where: { isPublic: true },
    });

    // 获取私有文档数
    const privateDocuments = await this.documentRepository.count({
      where: { isPublic: false },
    });

    // 获取总下载次数
    const totalDownloadsResult = await this.documentRepository
      .createQueryBuilder('document')
      .select('SUM(document.downloadCount)', 'total')
      .getRawOne();

    const totalDownloads = totalDownloadsResult.total || 0;

    // 获取分类统计
    const categoryStats = await this.documentRepository
      .createQueryBuilder('document')
      .select('document.category', 'category')
      .addSelect('COUNT(document.id)', 'count')
      .groupBy('document.category')
      .orderBy('count', 'DESC')
      .getRawMany();

    // 获取年份统计
    const yearStats = await this.documentRepository
      .createQueryBuilder('document')
      .select('document.year', 'year')
      .addSelect('COUNT(document.id)', 'count')
      .where('document.year IS NOT NULL')
      .groupBy('document.year')
      .orderBy('document.year', 'DESC')
      .getRawMany();

    return {
      totalDocuments,
      publicDocuments,
      privateDocuments,
      totalDownloads,
      categoryStats,
      yearStats,
    };
  }

  /**
   * 获取年度报告列表
   */
  async getAnnualReports(): Promise<Document[]> {
    return await this.documentRepository.find({
      where: {
        category: DocumentCategory.ANNUAL_REPORT,
        isPublic: true,
      },
      order: {
        year: 'DESC',
      },
    });
  }

  /**
   * 根据项目类型获取相关文档
   */
  async getDocumentsByProjectType(
    projectType: ProjectType,
  ): Promise<Document[]> {
    // 查询指定类型的项目
    const projects = await this.projectRepository.find({
      where: { projectType },
      select: ['id'],
    });

    const projectIds = projects.map((project) => project.id);

    // 如果没有找到项目，返回空数组
    if (projectIds.length === 0) {
      return [];
    }

    // 查询这些项目的相关文档
    return this.documentRepository.find({
      where: {
        project: { id: In(projectIds) },
        isPublic: true,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['project'],
    });
  }

  /**
   * 获取项目文档列表
   */
  async getProjectDocuments(projectId: string): Promise<Document[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`项目ID为 ${projectId} 的项目不存在`);
    }

    // 根据项目类型确定应返回的文档类别
    let categories: DocumentCategory[] = [DocumentCategory.PROJECT_DOCUMENT];

    // 针对不同项目类型可能有特定的文档类别要求
    if (
      project.projectType === ProjectType.GRANT ||
      project.projectType === ProjectType.SCHOLARSHIP
    ) {
      // 助学金/奖学金项目可能需要财务报表
      categories.push(DocumentCategory.FINANCIAL_STATEMENT);
    }

    return this.documentRepository.find({
      where: {
        project: { id: projectId },
        isPublic: true,
        category: In(categories),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
