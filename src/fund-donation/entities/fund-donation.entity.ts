// fund-donation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FundInstitution } from '../../fund-institution/entities/fund-institution.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Fund_Donation')
export class FundDonation {
  @PrimaryGeneratedColumn()
  donationId: number;

  @Column({ type: 'varchar', length: 100 })
  donorName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  donationAmount: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  donationDate: Date;

  @ManyToOne(() => FundInstitution, { nullable: false })
  @JoinColumn({ name: 'fund_institution_id' })
  fundInstitution: FundInstitution;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'donor_name' })
  donor: User;
}
