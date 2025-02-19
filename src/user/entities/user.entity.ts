import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';
import { ReviewLog } from '../../review-log/entities/review-log.entity';
import { DisbursementRecord } from '../../disbursement-record/entities/disbursement-record.entity';
import { FundDynamicLog } from '../../fund-dynamic-log/entities/fund-dynamic-log.entity';
import { FundDonation } from '../../fund-donation/entities/fund-donation.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID，主键' })
  user_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '用户名，唯一',
  })
  username: string;

  @Column({ type: 'varchar', length: 255, comment: '加密后的密码' })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '邮箱地址' })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '头像URL（可选）',
  })
  avatar: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: '所属基金机构ID，外键关联Fund_Institution',
  })
  institution_id: number;

  @Column({ type: 'tinyint', default: 1, comment: '用户状态：1-激活，0-禁用' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '最后修改时间' })
  updated_at: Date;

  // 多对多：用户可拥有多个角色
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'User_Role',
    joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
  })
  roles: Role[];

  // 一对多：用户作为申请者提交的申请
  @OneToMany(() => FundApplication, (application) => application.applicant)
  applications: FundApplication[];

  // 一对多：用户作为审核人员审核的记录
  @OneToMany(() => ReviewLog, (reviewLog) => reviewLog.reviewer)
  reviewLogs: ReviewLog[];

  // 一对多：用户作为拨款操作人员的拨款记录
  @OneToMany(() => DisbursementRecord, (record) => record.operator)
  disbursementRecords: DisbursementRecord[];

  // 一对多：用户可能作为捐赠来源（例如个人捐赠时，记录捐赠者ID）
  @OneToMany(() => FundDynamicLog, (log) => log.donationSourceDonor)
  donationDynamicLogs: FundDynamicLog[];

  // 一对多：用户接收的通知
  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];
}
