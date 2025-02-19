import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FundInstitution } from './entities/fund-institution.entity';
import { QueryFundInstitutionDto } from './dto/query-fund-institution.dto';
import { CreateFundInstitutionDto } from './dto/create-fund-institution.dto';
import { UpdateFundInstitutionDto } from './dto/update-fund-institution.dto';

@Injectable()
export class FundInstitutionService {
  constructor(
    @InjectRepository(FundInstitution)
    private readonly institutionRepository: Repository<FundInstitution>,
  ) {}

  /**
   * 机构信息查询与展示
   * 支持按机构名称搜索、排序和分页
   */
  async queryInstitutions(
    queryDto: QueryFundInstitutionDto,
  ): Promise<{ data: FundInstitution[]; total: number }> {
    const { q, page = 1, limit = 10, sort } = queryDto;
    // 创建查询构造器，别名为 institution
    const query = this.institutionRepository.createQueryBuilder('institution');

    // 如果提供搜索关键字，则按机构名称进行模糊查询
    if (q) {
      query.where('institution.institution_name LIKE :q', { q: `%${q}%` });
    }

    // 如果传入排序参数，格式如 "institution_name:asc"
    if (sort) {
      const [field, order] = sort.split(':');
      query.orderBy(
        `institution.${field}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // 分页：跳过前面 (page - 1) * limit 条记录，并限制返回数量
    query.skip((page - 1) * limit).take(limit);

    // 执行查询，返回数据和总记录数
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 机构详情获取
   * 根据机构ID查询单个基金机构的详细信息
   */
  async getInstitutionById(id: number): Promise<FundInstitution> {
    const institution = await this.institutionRepository.findOne({
      where: { institution_id: id },
    });
    if (!institution) {
      throw new NotFoundException(`Fund Institution with ID ${id} not found`);
    }
    return institution;
  }

  /**
   * 机构信息创建
   * 根据传入的 CreateFundInstitutionDto 创建新机构记录
   */
  async createInstitution(
    createDto: CreateFundInstitutionDto,
  ): Promise<FundInstitution> {
    const institution = this.institutionRepository.create(createDto);
    return await this.institutionRepository.save(institution);
  }

  /**
   * 机构信息更新
   * 根据机构ID更新机构的联系人、电话、邮箱、地址、描述等信息
   */
  async updateInstitution(
    id: number,
    updateDto: UpdateFundInstitutionDto,
  ): Promise<FundInstitution> {
    const institution = await this.getInstitutionById(id);
    // 合并更新数据
    Object.assign(institution, updateDto);
    return await this.institutionRepository.save(institution);
  }

  /**
   * 机构信息删除
   * 删除机构记录时需要考虑与项目申请等关联的情况，
   * 这里可以先进行关联数据校验，若存在关联数据则拒绝删除，
   * 或者采用级联删除策略（需根据业务需求调整）。
   */
  async deleteInstitution(id: number): Promise<void> {
    const institution = await this.getInstitutionById(id);
    // 例如：如果需要检查机构是否有关联的项目申请，可在此添加逻辑
    // const count = await this.projectRepository.count({ where: { institution_id: id } });
    // if(count > 0) {
    //   throw new BadRequestException('该机构下存在项目申请，不允许删除');
    // }
    await this.institutionRepository.remove(institution);
  }
}
