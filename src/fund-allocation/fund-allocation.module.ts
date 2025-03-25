import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundAllocation } from './entities/fund-allocation.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { FundPoolModule } from '../fund-pool/fund-pool.module';
import { FundAllocationService } from './fund-allocation.service';
import { FundAllocationController } from './fund-allocation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundAllocation, Project, User]),
    FundPoolModule,
  ],
  providers: [FundAllocationService],
  controllers: [FundAllocationController],
  exports: [FundAllocationService],
})
export class FundAllocationModule {}
