import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { Certificate } from '../../certificate/entities/certificate.entity';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  donor: User;

  @Column({ nullable: true, length: 100, name: 'donor_name' })
  donorName: string;

  @Column({ nullable: true, length: 100, name: 'donor_email' })
  donorEmail: string;

  @Column({ nullable: true, length: 20, name: 'donor_phone' })
  donorPhone: string;

  @ManyToOne(() => Project, (project) => project.donations)
  project: Project;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['onetime', 'monthly', 'quarterly', 'yearly'],
    default: 'onetime',
    name: 'donation_type',
  })
  donationType: string;

  @Column({ nullable: true })
  message: string;

  @Column({ default: false, name: 'is_anonymous' })
  isAnonymous: boolean;

  @Column({ default: false, name: 'is_certificate_generated' })
  isCertificateGenerated: boolean;

  @OneToOne(() => Certificate, (certificate) => certificate.donation, {
    nullable: true,
  })
  certificate: Certificate;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
