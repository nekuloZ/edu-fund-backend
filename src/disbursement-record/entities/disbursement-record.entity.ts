import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Disbursement_Record')
export class DisbursementRecord {
  @PrimaryGeneratedColumn({ comment: '拨款记录ID，主键' })
  record_id: number;

  // 多对一：拨款记录对应一个申请
  @ManyToOne(
    () => FundApplication,
    (application) => application.disbursementRecords,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  application: FundApplication;

  @Column({ type: 'int', comment: '申请ID', name: 'application_id' })
  application_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '拨款金额' })
  disbursement_amount: number;

  @CreateDateColumn({ type: 'datetime', comment: '拨款时间' })
  disbursement_date: Date;

  // 多对一：拨款记录由某个操作员（管理员/财务人员）执行
  @ManyToOne(() => User, (user) => user.disbursementRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  operator: User;

  @Column({
    type: 'int',
    comment: '执行拨款的管理员或财务人员ID',
    name: 'operator_id',
  })
  operator_id: number;

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
