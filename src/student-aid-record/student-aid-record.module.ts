import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAidRecord } from './entities/student-aid-record.entity';
import { Student } from '../student/entities/student.entity';
import { Project } from '../project/entities/project.entity';
import { StudentAidRecordService } from './student-aid-record.service';
import { StudentAidRecordController } from './student-aid-record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAidRecord, Student, Project])],
  providers: [StudentAidRecordService],
  controllers: [StudentAidRecordController],
  exports: [StudentAidRecordService],
})
export class StudentAidRecordModule {}
