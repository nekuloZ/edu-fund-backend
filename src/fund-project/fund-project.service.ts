import { Injectable } from '@nestjs/common';
import { CreateFundProjectDto } from './dto/create-fund-project.dto';
import { UpdateFundProjectDto } from './dto/update-fund-project.dto';

@Injectable()
export class FundProjectService {
  create(createFundProjectDto: CreateFundProjectDto) {
    return 'This action adds a new fundProject';
  }

  findAll() {
    return `This action returns all fundProject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundProject`;
  }

  update(id: number, updateFundProjectDto: UpdateFundProjectDto) {
    return `This action updates a #${id} fundProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundProject`;
  }
}
