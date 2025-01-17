import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('project_funds')
export class ProjectFund {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, { nullable: false })
  project: Project;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  allocatedAmount: number;
}
