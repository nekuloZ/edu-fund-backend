import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StudentApplication } from '../../student-applications/entities/student-application.entity';
import { User } from '../../users/entities/user.entity';

@Entity('application_reviews')
export class ApplicationReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentApplication, { nullable: false })
  application: StudentApplication;

  @ManyToOne(() => User, { nullable: true })
  reviewer: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reviewDate: Date;

  @Column({
    type: 'enum',
    enum: ['approved', 'rejected'],
    nullable: true,
  })
  reviewStatus: string;

  @Column({ type: 'text', nullable: true })
  comments: string;
}
