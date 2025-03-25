import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectApplication } from './entities/project-application.entity';
import { Project } from '../project/entities/project.entity';
import { ProjectApplicationService } from './project-application.service';
import { ProjectApplicationController } from './project-application.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectApplication, Project])],
  providers: [ProjectApplicationService],
  controllers: [ProjectApplicationController],
  exports: [ProjectApplicationService],
})
export class ProjectApplicationModule {}
