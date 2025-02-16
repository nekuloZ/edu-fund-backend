import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FundInstitutionService } from './fund-institution.service';
import { CreateFundInstitutionDto } from './dto/create-fund-institution.dto';

@Controller('fund-institutions')
export class FundInstitutionController {
  constructor(
    private readonly fundInstitutionService: FundInstitutionService,
  ) {}

  // 创建基金机构
  @Post()
  async create(@Body() createFundInstitutionDto: CreateFundInstitutionDto) {
    return this.fundInstitutionService.create(createFundInstitutionDto);
  }

  // 获取所有基金机构
  @Get()
  async findAll() {
    return this.fundInstitutionService.findAll();
  }

  // 根据ID获取基金机构
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.fundInstitutionService.findOne(id);
  }
}
