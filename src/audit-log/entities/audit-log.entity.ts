import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 50 })
  entity: string;

  @Column({ nullable: true, name: 'entity_id' })
  entityId: string;

  @Column({ type: 'simple-json', nullable: true, name: 'old_values' })
  oldValues: object;

  @Column({ type: 'simple-json', nullable: true, name: 'new_values' })
  newValues: object;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true, name: 'user_agent' })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
