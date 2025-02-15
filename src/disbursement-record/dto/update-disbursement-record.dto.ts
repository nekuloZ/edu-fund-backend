import { PartialType } from '@nestjs/mapped-types';
import { CreateDisbursementRecordDto } from './create-disbursement-record.dto';

export class UpdateDisbursementRecordDto extends PartialType(CreateDisbursementRecordDto) {}
