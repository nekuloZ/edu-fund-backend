import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Donation } from '../../donations/entities/donation.entity';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('fund_transactions')
export class FundTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Donation, { nullable: true })
  donation: Donation;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @ManyToOne(() => User, { nullable: true })
  student: User;

  @Column({ type: 'date', nullable: true })
  transactionDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;
}
