import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn()
  donationId: number;

  @Column()
  donorName: string;

  @Column({ nullable: true })
  donorEmail: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  donationDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;
}
