import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Disbursement_Record')
export class DisbursementRecord {
  @PrimaryGeneratedColumn({ comment: '拨款记录ID，主键' })
  record_id: number;

  @ManyToOne(
    () => FundApplication,
    (application) => application.disbursementRecords,
    { onDelete: 'CASCADE' },
  )
  application: FundApplication;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '拨款金额' })
  disbursement_amount: number;

  @CreateDateColumn({ type: 'datetime', comment: '拨款时间' })
  disbursement_date: Date;

  @ManyToOne(() => User, (user) => user.disbursementRecords, {
    onDelete: 'CASCADE',
  })
  operator: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'failed'],
    comment: '拨款状态',
  })
  status: 'pending' | 'confirmed' | 'failed';

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '备注（可选）',
  })
  note: string;
}
