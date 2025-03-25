import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from './entities/donation.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { QueryDonationDto } from './dto/query-donation.dto';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { PeriodicDonationDto } from './dto/periodic-donation.dto';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
  ) {}

  /**
   * 创建捐赠记录
   */
  async create(
    createDonationDto: CreateDonationDto,
    userId?: number,
  ): Promise<Donation> {
    // 查找项目是否存在
    const project = await this.projectRepository.findOne({
      where: { id: createDonationDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `未找到ID为${createDonationDto.projectId}的项目`,
      );
    }

    // 创建捐赠记录
    const donation = this.donationRepository.create({
      amount: createDonationDto.amount,
      donationType: createDonationDto.donationType,
      message: createDonationDto.message,
      isAnonymous: createDonationDto.isAnonymous,
      project,
    });

    // 如果用户已登录，关联用户信息
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: String(userId) },
        /*
        类型一致性 - 在大多数JavaScript/TypeScript应用中，ID通常作为数字处理，保持参数类型为number可以与其他API保持一致
        性能考虑 - 数字比字符串占用更少的内存，处理速度更快
        业务逻辑需要 - 有时需要对ID进行数学运算或比较
        数据库设计 - 很多数据库中用户ID使用整数类型作为自增主键 
        */
      });
      if (user) {
        donation.donor = user;
      }
    } else {
      // 如果用户未登录，必须提供捐赠者信息
      if (!createDonationDto.donorName || !createDonationDto.donorEmail) {
        throw new BadRequestException('未登录用户必须提供姓名和邮箱');
      }

      donation.donorName = createDonationDto.donorName;
      donation.donorEmail = createDonationDto.donorEmail;
      donation.donorPhone = createDonationDto.donorPhone;
    }

    // 保存捐赠记录
    const savedDonation = await this.donationRepository.save(donation);

    // 更新项目筹款金额
    project.raisedAmount =
      Number(project.raisedAmount) + Number(createDonationDto.amount);
    project.progress = Number(
      ((project.raisedAmount / project.targetAmount) * 100).toFixed(2),
    );
    await this.projectRepository.save(project);

    return savedDonation;
  }

  /**
   * 查询捐赠记录
   */
  async findAll(queryDto: QueryDonationDto): Promise<{
    items: Donation[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      projectId,
      donorId,
      keyword,
      startDate,
      endDate,
      donationType,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.project', 'project')
      .leftJoinAndSelect('donation.donor', 'donor')
      .leftJoinAndSelect('donation.certificate', 'certificate');

    // 按项目筛选
    if (projectId) {
      queryBuilder.andWhere('project.id = :projectId', { projectId });
    }

    // 按捐赠者筛选
    if (donorId) {
      queryBuilder.andWhere('donor.id = :donorId', { donorId });
    }

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(donation.donorName LIKE :keyword OR donation.message LIKE :keyword OR project.title LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'donation.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('donation.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('donation.createdAt <= :endDate', { endDate });
    }

    // 按捐赠类型筛选
    if (donationType) {
      queryBuilder.andWhere('donation.donationType = :donationType', {
        donationType,
      });
    }

    // 按金额范围筛选
    if (minAmount !== undefined) {
      queryBuilder.andWhere('donation.amount >= :minAmount', { minAmount });
    }
    if (maxAmount !== undefined) {
      queryBuilder.andWhere('donation.amount <= :maxAmount', { maxAmount });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页和排序
    queryBuilder
      .orderBy(`donation.${sortBy}`, sortOrder)
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
   * 获取指定用户的捐赠记录
   */
  async findByUser(
    userId: number,
    queryDto: QueryDonationDto,
  ): Promise<{
    items: Donation[];
    total: number;
    page: number;
    limit: number;
  }> {
    queryDto.donorId = String(userId);
    return this.findAll(queryDto);
  }

  /**
   * 根据ID查询捐赠记录
   */
  async findOne(id: string): Promise<Donation> {
    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: ['project', 'donor', 'certificate'],
    });

    if (!donation) {
      throw new NotFoundException(`未找到ID为${id}的捐赠记录`);
    }

    return donation;
  }

  /**
   * 生成捐赠证书
   */
  async generateCertificate(
    generateDto: GenerateCertificateDto,
  ): Promise<Certificate> {
    const donation = await this.findOne(generateDto.donationId);

    // 判断是否已经生成过证书
    if (donation.isCertificateGenerated) {
      throw new BadRequestException('该捐赠记录已经生成过证书');
    }

    // 创建证书
    const certificate = this.certificateRepository.create({
      donation,
      recipientName: generateDto.recipientName,
      issueDate: new Date(),
      certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // 随机生成证书编号
    });

    // 保存证书
    const savedCertificate = await this.certificateRepository.save(certificate);

    // 更新捐赠记录
    donation.isCertificateGenerated = true;
    donation.certificate = savedCertificate;
    await this.donationRepository.save(donation);

    return savedCertificate;
  }

  /**
   * 设置定期捐赠
   */
  async setPeriodicDonation(
    periodicDto: PeriodicDonationDto,
    userId: number,
  ): Promise<any> {
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { id: String(userId) },
    });
    if (!user) {
      throw new NotFoundException(`未找到ID为${userId}的用户`);
    }

    // 查找项目
    const project = await this.projectRepository.findOne({
      where: { id: periodicDto.projectId },
    });
    if (!project) {
      throw new NotFoundException(`未找到ID为${periodicDto.projectId}的项目`);
    }

    // 在实际应用中，这里应该调用支付系统的API设置定期捐赠
    // 这里只做模拟，创建一条捐赠记录
    const donation = this.donationRepository.create({
      donor: user,
      project,
      amount: periodicDto.amount,
      donationType: periodicDto.frequency,
      message: periodicDto.message,
      isAnonymous: periodicDto.isAnonymous,
    });

    const savedDonation = await this.donationRepository.save(donation);

    // 更新项目筹款金额
    project.raisedAmount =
      Number(project.raisedAmount) + Number(periodicDto.amount);
    project.progress = Number(
      ((project.raisedAmount / project.targetAmount) * 100).toFixed(2),
    );
    await this.projectRepository.save(project);

    return {
      success: true,
      message: '定期捐赠设置成功',
      donation: savedDonation,
    };
  }

  /**
   * 获取项目捐赠统计
   */
  async getProjectDonationStats(projectId: string): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`未找到ID为${projectId}的项目`);
    }

    // 获取捐赠总数
    const totalCount = await this.donationRepository.count({
      where: { project: { id: projectId } },
    });

    // 获取总金额
    const result = await this.donationRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'totalAmount')
      .where('donation.project.id = :projectId', { projectId })
      .getRawOne();

    // 获取最近5条捐赠记录
    const recentDonations = await this.donationRepository.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['donor'],
    });

    return {
      projectId,
      projectTitle: project.title,
      totalDonations: totalCount,
      totalAmount: result.totalAmount || 0,
      targetAmount: project.targetAmount,
      progress: project.progress,
      recentDonations: recentDonations.map((d) => ({
        id: d.id,
        amount: d.amount,
        date: d.createdAt,
        donorName: d.isAnonymous
          ? '匿名捐赠者'
          : d.donor
            ? d.donor.username
            : d.donorName,
        message: d.message,
      })),
    };
  }
}
