import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'simple-json', nullable: true })
  contact: {
    phone: string;
    email: string;
    address: string;
  };

  @Column({ type: 'simple-json', nullable: true, name: 'social_media' })
  socialMedia: {
    weibo?: string;
    wechat?: string;
    facebook?: string;
    twitter?: string;
  };

  @Column({ type: 'text', nullable: true, name: 'legal_info' })
  legalInfo: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
