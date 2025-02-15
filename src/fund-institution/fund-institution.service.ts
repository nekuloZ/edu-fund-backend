import { Injectable } from '@nestjs/common';
import { CreateFundInstitutionDto } from './dto/create-fund-institution.dto';
import { UpdateFundInstitutionDto } from './dto/update-fund-institution.dto';

@Injectable()
export class FundInstitutionService {
  create(createFundInstitutionDto: CreateFundInstitutionDto) {
    return 'This action adds a new fundInstitution';
  }

  findAll() {
    return `This action returns all fundInstitution`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundInstitution`;
  }

  update(id: number, updateFundInstitutionDto: UpdateFundInstitutionDto) {
    return `This action updates a #${id} fundInstitution`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundInstitution`;
  }
}
