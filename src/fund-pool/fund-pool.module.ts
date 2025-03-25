import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundPool } from './entities/fund-pool.entity';
import { FundPoolService } from './fund-pool.service';
import { FundPoolController } from './fund-pool.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FundPool])],
  providers: [FundPoolService],
  controllers: [FundPoolController],
  exports: [FundPoolService],
})
export class FundPoolModule {}
