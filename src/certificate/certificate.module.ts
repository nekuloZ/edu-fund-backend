import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Donation } from '../donation/entities/donation.entity';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Donation])],
  providers: [CertificateService],
  controllers: [CertificateController],
  exports: [CertificateService],
})
export class CertificateModule {}
