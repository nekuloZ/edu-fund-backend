import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundInstitution } from './entities/fund-institution.entity';
import { CreateFundInstitutionDto } from './dto/create-fund-institution.dto';

@Injectable()
export class FundInstitutionService {
  constructor(
    @InjectRepository(FundInstitution)
    private fundInstitutionRepository: Repository<FundInstitution>,
  ) {}

  // 创建新的基金机构
  async create(
    createFundInstitutionDto: CreateFundInstitutionDto,
  ): Promise<FundInstitution> {
    const fundInstitution = this.fundInstitutionRepository.create(
      createFundInstitutionDto,
    );
    return await this.fundInstitutionRepository.save(fundInstitution);
  }

  // 获取所有基金机构
  async findAll(): Promise<FundInstitution[]> {
    return await this.fundInstitutionRepository.find();
  }

  // 根据ID查询单个基金机构
  async findOne(id: number): Promise<FundInstitution> {
    return await this.fundInstitutionRepository.findOneBy({ id });
  }
}
