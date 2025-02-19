import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { FundInstitution } from '../../fund-institution/entities/fund-institution.entity';

@Entity('Fund_Donation')
export class FundDonation {
  @PrimaryGeneratedColumn({ comment: '捐赠ID，主键' })
  donation_id: number;

  @Column({ type: 'varchar', length: 100, comment: '捐赠人名称' })
  donor_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '捐赠金额' })
  donation_amount: number;

  @CreateDateColumn({ type: 'datetime', comment: '捐赠日期' })
  donation_date: Date;

  // 多对一：捐赠记录关联一个基金机构
  @ManyToOne(() => FundInstitution, (institution) => institution.donations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  fundInstitution: FundInstitution;

  @Column({
    type: 'int',
    comment: '捐赠所属基金机构ID',
    name: 'fund_institution_id',
  })
  fund_institution_id: number;
}
