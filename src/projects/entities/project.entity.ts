import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  goal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentAmount: number;

  @Column({
    type: 'enum',
    enum: ['preparing', 'in_progress', 'completed'],
    default: 'preparing',
  })
  status: string;

  @ManyToOne(() => User, (user) => user.projects)
  manager: User;
}
