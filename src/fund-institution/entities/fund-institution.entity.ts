import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';
import { FundDonation } from '../../fund-donation/entities/fund-donation.entity';
import { FundDynamicLog } from '../../fund-dynamic/entities/fund-dynamic-log.entity';

@Entity('Fund_Institution')
export class FundInstitution {
  @PrimaryGeneratedColumn({ comment: '机构ID，主键' })
  institution_id: number;

  @Column({ type: 'varchar', length: 100, comment: '机构名称' })
  institution_name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    unique: true,
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

  // 一对多：机构下的项目申请
  @OneToMany(() => FundApplication, (application) => application.institution)
  applications: FundApplication[];

  // 一对多：机构下的捐赠记录
  @OneToMany(() => FundDonation, (donation) => donation.fundInstitution)
  donations: FundDonation[];

  // 一对多：机构作为资金动态日志中拨款或捐赠来源
  @OneToMany(() => FundDynamicLog, (log) => log.donationSourceInstitution)
  donationDynamicLogs: FundDynamicLog[];

  @OneToMany(() => FundDynamicLog, (log) => log.disbursementSource)
  disbursementDynamicLogs: FundDynamicLog[];
}
