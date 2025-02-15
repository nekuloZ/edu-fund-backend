import { PartialType } from '@nestjs/mapped-types';
import { CreateFundApplicationDto } from './create-fund-application.dto';

export class UpdateFundApplicationDto extends PartialType(CreateFundApplicationDto) {}
