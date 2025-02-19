import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Review_Log')
export class ReviewLog {
  @PrimaryGeneratedColumn({ comment: '审核记录ID，主键' })
  review_id: number;

  // 多对一：审核记录对应一个申请
  @ManyToOne(() => FundApplication, (application) => application.reviewLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  application: FundApplication;

  @Column({ type: 'int', comment: '申请ID', name: 'application_id' })
  application_id: number;

  // 多对一：审核记录对应一个审核人员（用户）
  @ManyToOne(() => User, (user) => user.reviewLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  reviewer: User;

  @Column({ type: 'int', comment: '审核人员ID', name: 'reviewer_id' })
  reviewer_id: number;

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
