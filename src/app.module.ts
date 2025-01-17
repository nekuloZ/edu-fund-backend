import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { ApplicationDocumentsModule } from './application-documents/application-documents.module';
import { ApplicationReviewsModule } from './application-reviews/application-reviews.module';
import { DonationsModule } from './donations/donations.module';
import { FundTransactionsModule } from './fund-transactions/fund-transactions.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectFundsModule } from './project-funds/project-funds.module';
import { StudentApplicationsModule } from './student-applications/student-applications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'P@ssw0rd',
      database: process.env.DB_NAME || 'demo',
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true', // 根据环境变量控制
    }),
    UsersModule,
    ResourcesModule,
    RolesModule,
    AuthModule,
    PermissionsModule,
    RolePermissionsModule,
    ApplicationDocumentsModule,
    ApplicationReviewsModule,
    DonationsModule,
    FundTransactionsModule,
    ProjectsModule,
    ProjectFundsModule,
    StudentApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
