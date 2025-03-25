import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';

export enum ProgressStatus {
  EXCELLENT = 'excellent', // 优秀
  GOOD = 'good', // 良好
  AVERAGE = 'average', // 一般
  NEEDS_IMPROVEMENT = 'needs_improvement', // 需要改进
  CONCERNING = 'concerning', // 令人担忧
}

@Entity('academic_progress')
export class AcademicProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.academicProgress)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column()
  semester: string;

  @Column({ type: 'simple-json' })
  grades: {
    subject: string;
    score: number;
    ranking?: number;
  }[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  averageScore: number;

  @Column({ nullable: true })
  ranking: number;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.AVERAGE,
  })
  status: ProgressStatus;

  @Column({ type: 'text', nullable: true, name: 'teacher_comment' })
  teacherComment: string;

  @Column({ type: 'text', nullable: true, name: 'assessment' })
  assessment: string;

  @Column({ nullable: true, name: 'exam_date' })
  examDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
