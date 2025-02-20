import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundProjectType } from './entities/fund-project-type.entity';
import { FundProject } from '../fund-project/entities/fund-project.entity';
import { FundProjectTypeService } from './fund-project-type.service';
import { FundProjectTypeController } from './fund-project-type.controller';

@Module({
  imports: [
    // 注册 FundProjectType 实体及 FundProject 实体（用于删除前关联校验）
    TypeOrmModule.forFeature([FundProjectType, FundProject]),
  ],
  controllers: [FundProjectTypeController],
  providers: [FundProjectTypeService],
  exports: [FundProjectTypeService],
})
export class FundProjectTypeModule {}
