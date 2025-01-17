import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StudentApplication } from '../../student-applications/entities/student-application.entity';

@Entity('application_documents')
export class ApplicationDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentApplication, { nullable: false })
  application: StudentApplication;

  @Column({
    type: 'enum',
    enum: ['transcript', 'income_proof', 'employment_proof', 'other'],
  })
  documentType: string;

  @Column({ type: 'text' })
  documentPath: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}
