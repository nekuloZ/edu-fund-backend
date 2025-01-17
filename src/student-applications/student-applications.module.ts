import { Module } from '@nestjs/common';
import { StudentApplicationsService } from './student-applications.service';
import { StudentApplicationsController } from './student-applications.controller';

@Module({
  controllers: [StudentApplicationsController],
  providers: [StudentApplicationsService],
})
export class StudentApplicationsModule {}
