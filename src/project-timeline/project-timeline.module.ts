import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTimeline } from './entities/project-timeline.entity';
import { Project } from '../project/entities/project.entity';
import { ProjectTimelineService } from './project-timeline.service';
import { ProjectTimelineController } from './project-timeline.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTimeline, Project])],
  providers: [ProjectTimelineService],
  controllers: [ProjectTimelineController],
  exports: [ProjectTimelineService],
})
export class ProjectTimelineModule {}
