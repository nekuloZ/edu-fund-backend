import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { FundInstitution } from '../../fund-institution/entities/fund-institution.entity';
import { Role } from '../../role/entities/role.entity';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';
import { ReviewLog } from '../../review-log/entities/review-log.entity';
import { DisbursementRecord } from '../../disbursement-record/entities/disbursement-record.entity';
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

  // 关联基金机构（可为空）
  @ManyToOne(() => FundInstitution, (institution) => institution.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  institution: FundInstitution;

  @Column({ type: 'tinyint', default: 1, comment: '用户状态：1-激活，0-禁用' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '最后更新时间' })
  updated_at: Date;

  // 用户与角色的多对多关系（使用User_Role中间表）
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'User_Role',
    joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
  })
  roles: Role[];

  // 用户提交的项目申请
  @OneToMany(() => FundApplication, (application) => application.applicant)
  applications: FundApplication[];

  // 用户作为审核人员提交的审核记录
  @OneToMany(() => ReviewLog, (review) => review.reviewer)
  reviews: ReviewLog[];

  // 用户作为拨款操作人员提交的拨款记录
  @OneToMany(() => DisbursementRecord, (disbursement) => disbursement.operator)
  disbursementRecords: DisbursementRecord[];

  // 用户接收到的通知
  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];
}
