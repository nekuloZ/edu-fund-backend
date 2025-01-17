import { Injectable } from '@nestjs/common';
import { CreateProjectFundDto } from './dto/create-project-fund.dto';
import { UpdateProjectFundDto } from './dto/update-project-fund.dto';

@Injectable()
export class ProjectFundsService {
  create(createProjectFundDto: CreateProjectFundDto) {
    return 'This action adds a new projectFund';
  }

  findAll() {
    return `This action returns all projectFunds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectFund`;
  }

  update(id: number, updateProjectFundDto: UpdateProjectFundDto) {
    return `This action updates a #${id} projectFund`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectFund`;
  }
}
