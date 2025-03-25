import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  OrganizationResponseDto,
  PublicOrganizationDto,
} from './dto/organization-response.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {
    // 确保至少有一条机构数据
    this.ensureOrganizationExists();
  }

  /**
   * 确保机构数据存在，如不存在则创建默认记录
   */
  private async ensureOrganizationExists(): Promise<void> {
    const count = await this.organizationRepository.count();
    if (count === 0) {
      const defaultOrg = this.organizationRepository.create({
        name: '爱心助学公益组织',
        description: '致力于帮助贫困地区学生，提供教育资源支持。',
        contact: {
          phone: '010-12345678',
          email: 'contact@example.org',
          address: '北京市海淀区',
        },
      });
      await this.organizationRepository.save(defaultOrg);
    }
  }

  /**
   * 获取机构信息（管理员接口）
   */
  async getOrganizationInfo(): Promise<OrganizationResponseDto> {
    const organization = await this.findOrganization();
    return organization;
  }

  /**
   * 获取公开的机构信息（前台接口）
   */
  async getPublicOrganizationInfo(): Promise<PublicOrganizationDto> {
    const organization = await this.findOrganization();
    const { name, logo, description, website, contact, socialMedia } =
      organization;
    return {
      name,
      logo,
      description,
      website,
      contact,
      socialMedia,
    };
  }

  /**
   * 更新机构信息
   */
  async updateOrganizationInfo(
    updateDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.findOrganization();

    // 更新字段
    Object.assign(organization, updateDto);

    // 保存更新
    await this.organizationRepository.save(organization);

    return organization;
  }

  /**
   * 查找机构信息（内部使用）
   */
  private async findOrganization(): Promise<Organization> {
    // 由于机构信息通常只有一条记录，直接获取第一条
    const organization = await this.organizationRepository.findOne({
      where: {},
    });

    if (!organization) {
      throw new NotFoundException('机构信息不存在');
    }

    return organization;
  }

  async findAll() {
    // TODO: 实现获取所有组织的逻辑
    return {
      items: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }

  async findOne(id: string) {
    // TODO: 实现获取单个组织的逻辑
    return {
      id,
      name: '示例组织',
      description: '示例描述',
      logo: 'https://example.com/logo.png',
      website: 'https://example.com',
      contactEmail: 'contact@example.com',
      contactPhone: '400-123-4567',
      address: '北京市朝阳区xxx街道xxx号',
      status: 'active',
      operator: { id: '1', username: 'admin' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
    operatorId: string,
  ) {
    // TODO: 实现创建组织的逻辑
    return {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ...createOrganizationDto,
      operator: { id: operatorId },
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    // TODO: 实现更新组织的逻辑
    return {
      id,
      ...updateOrganizationDto,
      updatedAt: new Date().toISOString(),
    };
  }

  async remove(_id: string) {
    // TODO: 实现删除组织的逻辑
    return {
      statusCode: 200,
      message: '组织删除成功',
    };
  }

  async getStatistics() {
    // TODO: 实现获取组织统计数据的逻辑
    return {
      totalOrganizations: 50,
      activeOrganizations: 45,
      inactiveOrganizations: 5,
    };
  }
}
