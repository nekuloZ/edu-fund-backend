import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicProgress } from './entities/academic-progress.entity';
import { AcademicProgressService } from './academic-progress.service';
import { AcademicProgressController } from './academic-progress.controller';
import { Student } from '../student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicProgress, Student])],
  providers: [AcademicProgressService],
  controllers: [AcademicProgressController],
  exports: [AcademicProgressService],
})
export class AcademicProgressModule {}
