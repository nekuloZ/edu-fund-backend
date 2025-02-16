import { PartialType } from '@nestjs/mapped-types';
import { CreateFundDynamicLogDto } from './create-fund-dynamic-log.dto';

export class UpdateFundDynamicLogDto extends PartialType(CreateFundDynamicLogDto) {}
