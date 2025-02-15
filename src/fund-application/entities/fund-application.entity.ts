import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FundInstitution } from '../../fund-institution/entities/fund-institution.entity';
import { ApplicationAttachment } from '../../application-attachment/entities/application-attachment.entity';
import { ReviewLog } from '../../review-log/entities/review-log.entity';
import { DisbursementRecord } from '../../disbursement-record/entities/disbursement-record.entity';

@Entity('Fund_Application')
export class FundApplication {
  @PrimaryGeneratedColumn({ comment: '申请ID，主键' })
  application_id: number;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  applicant: User;

  @ManyToOne(() => FundInstitution, (institution) => institution.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  institution: FundInstitution;

  @Column({ type: 'varchar', length: 200, comment: '项目标题' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '项目详细描述' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '申请金额' })
  amount_requested: number;

  @Column({ type: 'text', nullable: true, comment: '资金使用计划' })
  use_plan: string;

  @Column({
    type: 'enum',
    enum: ['public_pool', 'other'],
    comment: '项目类型：public_pool（公共池）或other（其他项目）',
  })
  project_type: 'public_pool' | 'other';

  @Column({
    type: 'enum',
    enum: [
      'submitted',
      'pending_review',
      'approved',
      'rejected',
      'needs_revision',
    ],
    comment: '当前状态',
  })
  status:
    | 'submitted'
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'needs_revision';

  @CreateDateColumn({ type: 'datetime', comment: '提交时间' })
  submission_date: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '最后修改时间' })
  updated_date: Date;

  // 与项目附件的一对多关系
  @OneToMany(
    () => ApplicationAttachment,
    (attachment) => attachment.application,
  )
  attachments: ApplicationAttachment[];

  // 与审核记录的一对多关系
  @OneToMany(() => ReviewLog, (review) => review.application)
  reviews: ReviewLog[];

  // 与拨款记录的一对多关系
  @OneToMany(
    () => DisbursementRecord,
    (disbursement) => disbursement.application,
  )
  disbursementRecords: DisbursementRecord[];
}
