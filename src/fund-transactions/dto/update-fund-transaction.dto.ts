import { PartialType } from '@nestjs/mapped-types';
import { CreateFundTransactionDto } from './create-fund-transaction.dto';

export class UpdateFundTransactionDto extends PartialType(CreateFundTransactionDto) {}
