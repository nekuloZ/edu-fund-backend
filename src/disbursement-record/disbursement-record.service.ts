import { Injectable } from '@nestjs/common';
import { CreateDisbursementRecordDto } from './dto/create-disbursement-record.dto';
import { UpdateDisbursementRecordDto } from './dto/update-disbursement-record.dto';

@Injectable()
export class DisbursementRecordService {
  create(createDisbursementRecordDto: CreateDisbursementRecordDto) {
    return 'This action adds a new disbursementRecord';
  }

  findAll() {
    return `This action returns all disbursementRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} disbursementRecord`;
  }

  update(id: number, updateDisbursementRecordDto: UpdateDisbursementRecordDto) {
    return `This action updates a #${id} disbursementRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} disbursementRecord`;
  }
}
