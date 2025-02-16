import { Injectable } from '@nestjs/common';
import { CreateFundDonationDto } from './dto/create-fund-donation.dto';
import { UpdateFundDonationDto } from './dto/update-fund-donation.dto';

@Injectable()
export class FundDonationService {
  create(createFundDonationDto: CreateFundDonationDto) {
    return 'This action adds a new fundDonation';
  }

  findAll() {
    return `This action returns all fundDonation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundDonation`;
  }

  update(id: number, updateFundDonationDto: UpdateFundDonationDto) {
    return `This action updates a #${id} fundDonation`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundDonation`;
  }
}
