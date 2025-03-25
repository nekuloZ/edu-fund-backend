import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { Donation } from '../donation/entities/donation.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { QueryCertificateDto } from './dto/query-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,

    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
  ) {}

  /**
   * 创建新的证书
   */
  async create(
    createCertificateDto: CreateCertificateDto,
  ): Promise<Certificate> {
    // 查找捐赠记录
    const donation = await this.donationRepository.findOne({
      where: { id: createCertificateDto.donationId },
      relations: ['certificate'],
    });

    if (!donation) {
      throw new NotFoundException(
        `未找到ID为${createCertificateDto.donationId}的捐赠记录`,
      );
    }

    // 检查是否已经生成过证书
    if (donation.isCertificateGenerated) {
      throw new BadRequestException(`该捐赠记录已经生成过证书`);
    }

    // 创建证书
    const certificate = this.certificateRepository.create({
      recipientName: createCertificateDto.recipientName,
      issueDate: new Date(),
      certificateNumber:
        createCertificateDto.certificateNumber ||
        `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // 随机生成证书编号
      donation,
    });

    const savedCertificate = await this.certificateRepository.save(certificate);

    // 更新捐赠记录的证书状态
    donation.isCertificateGenerated = true;
    await this.donationRepository.save(donation);

    return savedCertificate;
  }

  /**
   * 查询证书列表
   */
  async findAll(queryDto: QueryCertificateDto): Promise<{
    items: Certificate[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      donationId,
      certificateNumber,
      recipientName,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.certificateRepository
      .createQueryBuilder('certificate')
      .leftJoinAndSelect('certificate.donation', 'donation')
      .leftJoinAndSelect('donation.project', 'project')
      .leftJoinAndSelect('donation.donor', 'donor');

    // 按捐赠ID筛选
    if (donationId) {
      queryBuilder.andWhere('donation.id = :donationId', { donationId });
    }

    // 按证书编号筛选
    if (certificateNumber) {
      queryBuilder.andWhere(
        'certificate.certificateNumber LIKE :certificateNumber',
        {
          certificateNumber: `%${certificateNumber}%`,
        },
      );
    }

    // 按收件人姓名筛选
    if (recipientName) {
      queryBuilder.andWhere('certificate.recipientName LIKE :recipientName', {
        recipientName: `%${recipientName}%`,
      });
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'certificate.issueDate BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('certificate.issueDate >= :startDate', {
        startDate,
      });
    } else if (endDate) {
      queryBuilder.andWhere('certificate.issueDate <= :endDate', { endDate });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder
      .orderBy('certificate.issueDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const items = await queryBuilder.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 根据ID查找证书
   */
  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['donation', 'donation.project', 'donation.donor'],
    });

    if (!certificate) {
      throw new NotFoundException(`未找到ID为${id}的证书`);
    }

    return certificate;
  }

  /**
   * 根据证书编号查找证书
   */
  async findByNumber(certificateNumber: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { certificateNumber },
      relations: ['donation', 'donation.project', 'donation.donor'],
    });

    if (!certificate) {
      throw new NotFoundException(`未找到编号为${certificateNumber}的证书`);
    }

    return certificate;
  }

  /**
   * 更新证书信息
   */
  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
  ): Promise<Certificate> {
    const certificate = await this.findOne(id);

    // 更新证书信息
    Object.assign(certificate, updateCertificateDto);

    return await this.certificateRepository.save(certificate);
  }

  /**
   * 验证证书有效性
   */
  async verifyCertificate(certificateNumber: string): Promise<{
    isValid: boolean;
    certificateInfo?: any;
  }> {
    try {
      const certificate = await this.findByNumber(certificateNumber);

      return {
        isValid: true,
        certificateInfo: {
          certificateNumber: certificate.certificateNumber,
          recipientName: certificate.recipientName,
          issueDate: certificate.issueDate,
          donationAmount: certificate.donation.amount,
          projectName: certificate.donation.project.title,
          donorName: certificate.donation.isAnonymous
            ? '匿名捐赠者'
            : certificate.donation.donor?.username ||
              certificate.donation.donorName,
        },
      };
    } catch {
      return {
        isValid: false,
      };
    }
  }

  /**
   * 标记证书为已下载
   */
  async markAsDownloaded(id: string): Promise<Certificate> {
    const certificate = await this.findOne(id);

    certificate.isDownloaded = true;

    return await this.certificateRepository.save(certificate);
  }

  /**
   * 生成证书文件链接
   * 注意：实际应用中，这里应该调用文件生成服务来创建PDF证书
   */
  async generateCertificateFile(id: string): Promise<{ fileUrl: string }> {
    const certificate = await this.findOne(id);

    // 模拟生成PDF证书文件的URL
    const fileUrl = `/certificates/${certificate.certificateNumber}.pdf`;

    // 更新证书的文件URL
    certificate.fileUrl = fileUrl;
    await this.certificateRepository.save(certificate);

    return { fileUrl };
  }
}
