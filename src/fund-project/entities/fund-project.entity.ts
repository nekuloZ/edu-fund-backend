import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';

@Entity('Fund_Project')
export class FundProject {
  @PrimaryGeneratedColumn({ comment: '项目ID，主键' })
  project_id: number;

  @Column({ type: 'varchar', length: 200, comment: '项目名称' })
  project_name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '项目负责人',
  })
  project_leader: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '项目预算',
  })
  budget: number;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '项目进度' })
  progress: string;

  @Column({ type: 'text', nullable: true, comment: '项目总体描述' })
  description: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '最后修改时间' })
  updated_at: Date;

  // 一对多：项目下的申请记录
  @OneToMany(() => FundApplication, (application) => application.project)
  applications: FundApplication[];
}
