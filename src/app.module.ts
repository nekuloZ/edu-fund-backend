import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ProjectTimelineModule } from './project-timeline/project-timeline.module';
import { DonationModule } from './donation/donation.module';
import { CertificateModule } from './certificate/certificate.module';
import { FundPoolModule } from './fund-pool/fund-pool.module';
import { FundAllocationModule } from './fund-allocation/fund-allocation.module';
import { ProjectApplicationModule } from './project-application/project-application.module';
import { StudentModule } from './student/student.module';
import { StudentAidRecordModule } from './student-aid-record/student-aid-record.module';
import { AcademicProgressModule } from './academic-progress/academic-progress.module';
import { OrganizationModule } from './organization/organization.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { DocumentModule } from './document/document.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'P@ssw0rd',
      database: 'demo3.0',
      autoLoadEntities: true,
      synchronize: false, // 关闭同步，避免冲突
      logging: true, // 添加日志记录
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    OrganizationModule,
    ProjectApplicationModule,
    DonationModule,
    ProjectModule,
    ProjectTimelineModule,
    CertificateModule,
    FundPoolModule,
    FundAllocationModule,
    StudentModule,
    StudentAidRecordModule,
    AcademicProgressModule,
    AuditLogModule,
    DocumentModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
