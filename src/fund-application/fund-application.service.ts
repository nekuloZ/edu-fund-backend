import { Injectable } from '@nestjs/common';
import { CreateFundApplicationDto } from './dto/create-fund-application.dto';
import { UpdateFundApplicationDto } from './dto/update-fund-application.dto';

@Injectable()
export class FundApplicationService {
  create(createFundApplicationDto: CreateFundApplicationDto) {
    return 'This action adds a new fundApplication';
  }

  findAll() {
    return `This action returns all fundApplication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundApplication`;
  }

  update(id: number, updateFundApplicationDto: UpdateFundApplicationDto) {
    return `This action updates a #${id} fundApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundApplication`;
  }
}
