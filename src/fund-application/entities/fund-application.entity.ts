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
import { FundProject } from '../../fund-project/entities/fund-project.entity';
import { FundProjectType } from '../../fund-project-type/entities/fund-project-type.entity';
import { ApplicationStatus } from '../../application-status/entities/application-status.entity';
import { ApplicationAttachment } from '../../application-attachment/entities/application-attachment.entity';
import { ReviewLog } from '../../review-log/entities/review-log.entity';
import { DisbursementRecord } from '../../disbursement-record/entities/disbursement-record.entity';

@Entity('Fund_Application')
export class FundApplication {
  @PrimaryGeneratedColumn({ comment: '申请ID，主键' })
  application_id: number;

  // 申请人（用户）
  @ManyToOne(() => User, (user) => user.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  applicant: User;

  @Column({ type: 'int', comment: '提交申请的用户ID', name: 'applicant_id' })
  applicant_id: number;

  // 申请所属机构（可为空）
  @ManyToOne(() => FundInstitution, (institution) => institution.applications, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  institution: FundInstitution;

  @Column({ type: 'int', nullable: true, name: 'institution_id' })
  institution_id: number;

  // 关联的基金项目
  @ManyToOne(() => FundProject, (project) => project.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: FundProject;

  @Column({ type: 'int', comment: '关联的基金项目ID', name: 'project_id' })
  project_id: number;

  // 关联的项目类型
  @ManyToOne(() => FundProjectType, (projectType) => projectType.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  projectType: FundProjectType;

  @Column({ type: 'int', comment: '关联的项目类型ID', name: 'project_type_id' })
  project_type_id: number;

  // 申请状态
  @ManyToOne(() => ApplicationStatus, (status) => status.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  status: ApplicationStatus;

  @Column({ type: 'int', comment: '申请状态ID', name: 'status_id' })
  status_id: number;

  @Column({ type: 'varchar', length: 200, comment: '项目标题' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '项目详细描述' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '申请金额' })
  amount_requested: number;

  @Column({ type: 'text', nullable: true, comment: '资金使用计划' })
  use_plan: string;

  @CreateDateColumn({ type: 'datetime', comment: '提交时间' })
  submission_date: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '最后修改时间' })
  updated_date: Date;

  // 一对多：申请附件
  @OneToMany(
    () => ApplicationAttachment,
    (attachment) => attachment.application,
  )
  attachments: ApplicationAttachment[];

  // 一对多：审核记录
  @OneToMany(() => ReviewLog, (reviewLog) => reviewLog.application)
  reviewLogs: ReviewLog[];

  // 一对多：拨款记录
  @OneToMany(() => DisbursementRecord, (record) => record.application)
  disbursementRecords: DisbursementRecord[];
}
