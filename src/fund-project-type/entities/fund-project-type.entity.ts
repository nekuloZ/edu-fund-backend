import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';

@Entity('Fund_Project_Type')
export class FundProjectType {
  @PrimaryGeneratedColumn({ comment: '项目类型ID，主键' })
  project_type_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '项目类型名称，如 public_pool、scholarship、grant 等',
  })
  project_type_name: string;

  @Column({ type: 'text', nullable: true, comment: '项目类型描述' })
  description: string;

  // 一对多：对应该类型的申请记录
  @OneToMany(() => FundApplication, (application) => application.projectType)
  applications: FundApplication[];
}
