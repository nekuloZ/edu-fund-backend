import { PartialType } from '@nestjs/mapped-types';
import { CreateFundInstitutionDto } from './create-fund-institution.dto';

export class UpdateFundInstitutionDto extends PartialType(CreateFundInstitutionDto) {}
