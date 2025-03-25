import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 50 })
  type: string;

  @Column()
  size: number;

  @Column({
    type: 'enum',
    enum: ['annual-report', 'financial-statement', 'project-document', 'other'],
  })
  category: string;

  @Column({ nullable: true })
  year: number;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @Column({ default: 0, name: 'download_count' })
  downloadCount: number;

  @Column({ default: true, name: 'is_public' })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
