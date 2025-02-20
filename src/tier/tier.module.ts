import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tier } from './entities/tier.entity';
import { TierService } from './tier.service';
import { TierController } from './tier.controller';

@Module({
  imports: [
    // 注册 Tier 实体
    TypeOrmModule.forFeature([Tier]),
  ],
  controllers: [TierController],
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}
