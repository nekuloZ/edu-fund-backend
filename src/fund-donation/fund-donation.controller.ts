import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FundDonationService } from './fund-donation.service';
import { CreateFundDonationDto } from './dto/create-fund-donation.dto';
import { UpdateFundDonationDto } from './dto/update-fund-donation.dto';

@Controller('fund-donation')
export class FundDonationController {
  constructor(private readonly fundDonationService: FundDonationService) {}

  @Post()
  create(@Body() createFundDonationDto: CreateFundDonationDto) {
    return this.fundDonationService.create(createFundDonationDto);
  }

  @Get()
  findAll() {
    return this.fundDonationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundDonationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFundDonationDto: UpdateFundDonationDto,
  ) {
    return this.fundDonationService.update(+id, updateFundDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundDonationService.remove(+id);
  }
}
