import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';

@Entity('Application_Status')
export class ApplicationStatus {
  @PrimaryGeneratedColumn({ comment: '状态ID，主键' })
  status_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment:
      '申请状态名称，如 submitted、pending_review、approved、rejected、needs_revision',
  })
  status_name: string;

  @Column({ type: 'text', nullable: true, comment: '状态描述' })
  description: string;

  // 一对多：该状态对应的申请记录
  @OneToMany(() => FundApplication, (application) => application.status)
  applications: FundApplication[];
}
