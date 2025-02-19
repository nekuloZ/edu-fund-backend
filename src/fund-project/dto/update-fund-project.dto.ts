import { PartialType } from '@nestjs/mapped-types';
import { CreateFundProjectDto } from './create-fund-project.dto';

export class UpdateFundProjectDto extends PartialType(CreateFundProjectDto) {}
