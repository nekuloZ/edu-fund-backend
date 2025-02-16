import { Injectable } from '@nestjs/common';
import { CreateFundDynamicLogDto } from './dto/create-fund-dynamic-log.dto';
import { UpdateFundDynamicLogDto } from './dto/update-fund-dynamic-log.dto';

@Injectable()
export class FundDynamicLogService {
  create(createFundDynamicLogDto: CreateFundDynamicLogDto) {
    return 'This action adds a new fundDynamicLog';
  }

  findAll() {
    return `This action returns all fundDynamicLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundDynamicLog`;
  }

  update(id: number, updateFundDynamicLogDto: UpdateFundDynamicLogDto) {
    return `This action updates a #${id} fundDynamicLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundDynamicLog`;
  }
}
