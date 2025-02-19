import { Injectable } from '@nestjs/common';
import { CreateFundProjectTypeDto } from './dto/create-fund-project-type.dto';
import { UpdateFundProjectTypeDto } from './dto/update-fund-project-type.dto';

@Injectable()
export class FundProjectTypeService {
  create(createFundProjectTypeDto: CreateFundProjectTypeDto) {
    return 'This action adds a new fundProjectType';
  }

  findAll() {
    return `This action returns all fundProjectType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundProjectType`;
  }

  update(id: number, updateFundProjectTypeDto: UpdateFundProjectTypeDto) {
    return `This action updates a #${id} fundProjectType`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundProjectType`;
  }
}
