import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Donation } from '../../donation/entities/donation.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Donation, (donation) => donation.certificate)
  @JoinColumn()
  donation: Donation;

  @Column({ name: 'certificate_number', unique: true })
  certificateNumber: string;

  @Column({ name: 'recipient_name', length: 100 })
  recipientName: string;

  @Column({ name: 'issue_date' })
  issueDate: Date;

  @Column({ nullable: true, name: 'file_url' })
  fileUrl: string;

  @Column({ default: false, name: 'is_downloaded' })
  isDownloaded: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
