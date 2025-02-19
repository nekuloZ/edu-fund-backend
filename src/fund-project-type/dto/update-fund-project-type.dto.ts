import { PartialType } from '@nestjs/mapped-types';
import { CreateFundProjectTypeDto } from './create-fund-project-type.dto';

export class UpdateFundProjectTypeDto extends PartialType(CreateFundProjectTypeDto) {}
