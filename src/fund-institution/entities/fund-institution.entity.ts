import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';

@Entity('Fund_Institution')
export class FundInstitution {
  @PrimaryGeneratedColumn({ comment: '机构ID，主键' })
  institution_id: number;

  @Column({ type: 'varchar', length: 100, comment: '机构名称' })
  institution_name: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
    comment: '机构编码，唯一（可选）',
  })
  institution_code: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '联系人' })
  contact_person: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '机构邮箱' })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '机构地址' })
  address: string;

  @Column({ type: 'text', nullable: true, comment: '机构描述' })
  description: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  // 一个基金机构下的多个用户
  @OneToMany(() => User, (user) => user.institution)
  users: User[];

  // 一个基金机构下的多个项目申请
  @OneToMany(() => FundApplication, (application) => application.institution)
  applications: FundApplication[];
}
