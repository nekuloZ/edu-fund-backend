import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
