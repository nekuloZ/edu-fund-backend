import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectFundDto } from './create-project-fund.dto';

export class UpdateProjectFundDto extends PartialType(CreateProjectFundDto) {}
