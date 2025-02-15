import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Review_Log')
export class ReviewLog {
  @PrimaryGeneratedColumn({ comment: '审核记录ID，主键' })
  review_id: number;

  @ManyToOne(() => FundApplication, (application) => application.reviews, {
    onDelete: 'CASCADE',
  })
  application: FundApplication;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  reviewer: User;

  @Column({ type: 'tinyint', comment: '审核阶段，例如1-初审，2-复审' })
  review_stage: number;

  @Column({ type: 'text', nullable: true, comment: '审核意见' })
  review_opinion: string;

  @Column({
    type: 'enum',
    enum: ['approved', 'rejected', 'needs_revision'],
    comment: '审核结果',
  })
  review_result: 'approved' | 'rejected' | 'needs_revision';

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '审核附件路径（可选）',
  })
  review_attachment: string;

  @CreateDateColumn({ type: 'datetime', comment: '审核时间' })
  review_date: Date;
}
