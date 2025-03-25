import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('fund_pool')
export class FundPool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_balance' })
  totalBalance: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'available_balance',
  })
  availableBalance: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'allocated_amount',
  })
  allocatedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'pending_amount' })
  pendingAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'warning_line' })
  warningLine: number;

  @UpdateDateColumn({ name: 'last_updated' })
  lastUpdated: Date;
}
