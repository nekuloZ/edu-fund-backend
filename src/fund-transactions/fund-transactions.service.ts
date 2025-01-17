import { Injectable } from '@nestjs/common';
import { CreateFundTransactionDto } from './dto/create-fund-transaction.dto';
import { UpdateFundTransactionDto } from './dto/update-fund-transaction.dto';

@Injectable()
export class FundTransactionsService {
  create(createFundTransactionDto: CreateFundTransactionDto) {
    return 'This action adds a new fundTransaction';
  }

  findAll() {
    return `This action returns all fundTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundTransaction`;
  }

  update(id: number, updateFundTransactionDto: UpdateFundTransactionDto) {
    return `This action updates a #${id} fundTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundTransaction`;
  }
}
