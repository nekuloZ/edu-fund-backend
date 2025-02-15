import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { DisbursementRecordModule } from './disbursement-record/disbursement-record.module';
import { ReviewLogModule } from './review-log/review-log.module';
import { ApplicationAttachmentModule } from './application-attachment/application-attachment.module';
import { FundApplicationModule } from './fund-application/fund-application.module';
import { FundInstitutionModule } from './fund-institution/fund-institution.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'P@ssw0rd',
      database: 'demo2',
      autoLoadEntities: true,
      synchronize: false,
      logging: true, // 添加日志记录
    }),
    UserModule,
    RoleModule,
    PermissionModule,
    FundInstitutionModule,
    FundApplicationModule,
    ApplicationAttachmentModule,
    ReviewLogModule,
    DisbursementRecordModule,
    NotificationModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
