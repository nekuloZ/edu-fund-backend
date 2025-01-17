import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundTransactionsService } from './fund-transactions.service';
import { CreateFundTransactionDto } from './dto/create-fund-transaction.dto';
import { UpdateFundTransactionDto } from './dto/update-fund-transaction.dto';

@Controller('fund-transactions')
export class FundTransactionsController {
  constructor(private readonly fundTransactionsService: FundTransactionsService) {}

  @Post()
  create(@Body() createFundTransactionDto: CreateFundTransactionDto) {
    return this.fundTransactionsService.create(createFundTransactionDto);
  }

  @Get()
  findAll() {
    return this.fundTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundTransactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundTransactionDto: UpdateFundTransactionDto) {
    return this.fundTransactionsService.update(+id, updateFundTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundTransactionsService.remove(+id);
  }
}
