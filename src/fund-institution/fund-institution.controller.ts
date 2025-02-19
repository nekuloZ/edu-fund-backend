import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FundInstitutionService } from './fund-institution.service';
import { QueryFundInstitutionDto } from './dto/query-fund-institution.dto';
import { CreateFundInstitutionDto } from './dto/create-fund-institution.dto';
import { UpdateFundInstitutionDto } from './dto/update-fund-institution.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/fund-institutions')
@UseGuards(JwtAuthGuard) // 整个控制器受 JWT 保护
export class FundInstitutionController {
  constructor(
    private readonly fundInstitutionService: FundInstitutionService,
  ) {}

  /**
   * 机构信息查询与展示
   * GET /api/fund-institutions
   * 支持关键字搜索、排序和分页
   */
  @Get()
  async getInstitutions(@Query() query: QueryFundInstitutionDto) {
    return await this.fundInstitutionService.queryInstitutions(query);
  }

  /**
   * 机构详情获取
   * GET /api/fund-institutions/:id
   * 根据机构ID查询单个基金机构的详细信息
   */
  @Get(':id')
  async getInstitutionById(@Param('id') id: number) {
    return await this.fundInstitutionService.getInstitutionById(id);
  }

  /**
   * 机构信息创建
   * POST /api/fund-institutions
   * 根据传入的 CreateFundInstitutionDto 创建新机构记录
   */
  @Post()
  async createInstitution(@Body() createDto: CreateFundInstitutionDto) {
    return await this.fundInstitutionService.createInstitution(createDto);
  }

  /**
   * 机构信息更新
   * PUT /api/fund-institutions/:id
   * 根据机构ID更新机构信息（如联系人、电话、邮箱、地址、描述等）
   */
  @Put(':id')
  async updateInstitution(
    @Param('id') id: number,
    @Body() updateDto: UpdateFundInstitutionDto,
  ) {
    return await this.fundInstitutionService.updateInstitution(id, updateDto);
  }

  /**
   * 机构信息删除
   * DELETE /api/fund-institutions/:id
   * 删除机构记录（可在 Service 中校验关联数据后再删除）
   */
  @Delete(':id')
  async deleteInstitution(@Param('id') id: number) {
    await this.fundInstitutionService.deleteInstitution(id);
    return { message: '机构删除成功' };
  }
}
