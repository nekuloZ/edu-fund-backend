import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import {
  TimelineType,
  TimelineStatus,
} from '../dto/create-project-timeline.dto';

@Entity('project_timelines')
export class ProjectTimeline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.timeline)
  project: Project;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({
    type: 'enum',
    enum: TimelineType,
    default: TimelineType.PROGRESS,
  })
  type: TimelineType;

  @Column({
    type: 'enum',
    enum: TimelineStatus,
    default: TimelineStatus.PENDING,
  })
  status: TimelineStatus;

  @Column({ type: 'json', nullable: true })
  images?: string[];

  @ManyToOne(() => User)
  operator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
