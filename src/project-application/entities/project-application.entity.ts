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

@Entity('project_applications')
export class ProjectApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.applications)
  project: Project;

  @ManyToOne(() => User)
  applicant: User;

  @Column({ length: 100, name: 'applicant_name' })
  applicantName: string;

  @Column({ length: 100, name: 'applicant_organization' })
  applicantOrganization: string;

  @Column({ length: 50, name: 'applicant_email' })
  applicantEmail: string;

  @Column({ length: 20, name: 'applicant_phone' })
  applicantPhone: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'requested_amount',
  })
  requestedAmount: number;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ type: 'simple-json', nullable: true })
  details: object;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @ManyToOne(() => User, { nullable: true })
  reviewer: User;

  @Column({ type: 'text', nullable: true, name: 'review_comment' })
  reviewComment: string;

  @Column({ nullable: true, name: 'review_date' })
  reviewDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
