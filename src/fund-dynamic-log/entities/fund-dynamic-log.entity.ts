import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { FundInstitution } from '../../fund-institution/entities/fund-institution.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Fund_Dynamic_Log')
export class FundDynamicLog {
  @PrimaryGeneratedColumn({ comment: '资金动态日志ID，主键' })
  log_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '资金动态类型，如拨款、捐赠等',
  })
  log_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '资金变动金额' })
  amount: number;

  @CreateDateColumn({ type: 'datetime', comment: '交易日期' })
  transaction_date: Date;

  // 多对一：捐赠来源的基金机构（可为空）
  @ManyToOne(
    () => FundInstitution,
    (institution) => institution.donationDynamicLogs,
    { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
  )
  donationSourceInstitution: FundInstitution;

  @Column({ type: 'int', nullable: true, name: 'donation_source_institution' })
  donation_source_institution: number;

  // 多对一：捐赠来源的捐款者（可为空）
  @ManyToOne(() => User, (user) => user.donationDynamicLogs, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  donationSourceDonor: User;

  @Column({ type: 'int', nullable: true, name: 'donation_source_donor' })
  donation_source_donor: number;

  // 多对一：拨款来源的基金机构（可为空）
  @ManyToOne(
    () => FundInstitution,
    (institution) => institution.disbursementDynamicLogs,
    { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
  )
  disbursementSource: FundInstitution;

  @Column({ type: 'int', nullable: true, name: 'disbursement_source' })
  disbursement_source: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '资金去向（如项目名称、账户等）',
  })
  fund_destination: string;

  @Column({
    type: 'enum',
    enum: ['completed', 'failed', 'pending'],
    comment: '资金变动状态',
  })
  status: 'completed' | 'failed' | 'pending';
}
