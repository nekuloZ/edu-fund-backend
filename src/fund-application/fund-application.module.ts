import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundApplicationService } from './fund-application.service';
import { FundApplicationController } from './fund-application.controller';
import { FundApplication } from './entities/fund-application.entity';
import { ApplicationAttachment } from '../application-attachment/entities/application-attachment.entity';

@Module({
  imports: [
    // 注册 FundApplication 和 ApplicationAttachment 实体，便于 TypeORM 注入使用
    TypeOrmModule.forFeature([FundApplication, ApplicationAttachment]),
  ],
  controllers: [FundApplicationController],
  providers: [FundApplicationService],
  exports: [FundApplicationService],
})
export class FundApplicationModule {}
