// fund-dynamic-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FundInstitution } from '../../fund-institution/entities/fund-institution.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Fund_Dynamic_Log')
export class FundDynamicLog {
  @PrimaryGeneratedColumn()
  logId: number;

  @Column({ type: 'varchar', length: 50 })
  logType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;

  @ManyToOne(() => FundInstitution, { nullable: true })
  @JoinColumn({ name: 'donation_source_institution' })
  donationSourceInstitution: FundInstitution;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'donation_source_donor' })
  donationSourceDonor: User;

  @ManyToOne(() => FundInstitution, { nullable: true })
  @JoinColumn({ name: 'disbursement_source' })
  disbursementSource: FundInstitution;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fundDestination: string;

  @Column({
    type: 'enum',
    enum: ['completed', 'failed', 'pending'],
    default: 'pending',
  })
  status: string;
}
