import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Project } from '../../project/entities/project.entity';

export enum AidType {
  TUITION = 'tuition', // 学费资助
  LIVING = 'living', // 生活费资助
  SUPPLIES = 'supplies', // 学习用品
  TRANSPORTATION = 'transportation', // 交通费
  MEDICAL = 'medical', // 医疗费
  OTHER = 'other', // 其他
}

@Entity('student_aid_records')
export class StudentAidRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.aidRecords)
  student: Student;

  @Column()
  studentId: string;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @Column({ nullable: true })
  projectId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: AidType,
    default: AidType.OTHER,
  })
  aidType: AidType;

  @Column({ length: 100 })
  purpose: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: false })
  acknowledged: boolean;

  @Column({ nullable: true })
  acknowledgedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
