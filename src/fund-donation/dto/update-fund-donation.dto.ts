import { PartialType } from '@nestjs/mapped-types';
import { CreateFundDonationDto } from './create-fund-donation.dto';

export class UpdateFundDonationDto extends PartialType(CreateFundDonationDto) {}
