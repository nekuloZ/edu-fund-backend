import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, Project, User, Certificate])],
  providers: [DonationService],
  controllers: [DonationController],
  exports: [DonationService],
})
export class DonationModule {}
