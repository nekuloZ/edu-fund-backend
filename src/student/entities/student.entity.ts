import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentAidRecord } from '../../student-aid-record/entities/student-aid-record.entity';
import { AcademicProgress } from '../../academic-progress/entities/academic-progress.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  gender: string;

  @Column()
  birthdate: Date;

  @Column({ nullable: true })
  avatar: string;

  @Column({ name: 'school_name' })
  schoolName: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  class: string;

  @Column({ type: 'simple-json' })
  address: {
    province: string;
    city: string;
    district: string;
    detail: string;
  };

  @Column({ nullable: true, name: 'guardian_name' })
  guardianName: string;

  @Column({ nullable: true, name: 'guardian_phone' })
  guardianPhone: string;

  @Column({ nullable: true, name: 'guardian_relationship' })
  guardianRelationship: string;

  @Column({ type: 'text', nullable: true })
  background: string;

  @OneToMany(() => StudentAidRecord, (record) => record.student)
  aidRecords: StudentAidRecord[];

  @OneToMany(() => AcademicProgress, (progress) => progress.student)
  academicProgress: AcademicProgress[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
